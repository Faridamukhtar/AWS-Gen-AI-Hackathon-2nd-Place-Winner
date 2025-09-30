import json
import boto3
import os
import base64
import uuid
from datetime import datetime

# === AWS Clients ===
bedrock = boto3.client("bedrock-runtime", region_name="us-west-2")
s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

# === Config ===
TABLE_NAME = os.environ.get("DYNAMODB_TABLE", "user-feedback")
BUCKET = os.environ.get("SUBMISSION_BUCKET", "genai-task-submissions")
table = dynamodb.Table(TABLE_NAME)

def handler(event, context):
    try:
        # --- Parse request ---
        body = json.loads(event.get("body", "{}"))
        userId = body["userId"]
        taskId = str(body["taskId"])
        milestoneId = body.get("milestoneId", "final")
        description = body.get("description", "")
        fileContent = body.get("fileContent")

        # --- Save file to S3 (if present) ---
        fileUrl, decoded_text = None, ""
        if fileContent:
            file_bytes = base64.b64decode(fileContent)
            decoded_text = file_bytes.decode("utf-8", errors="ignore")
            file_key = f"{userId}/{taskId}/{uuid.uuid4().hex}.txt"
            s3.put_object(Bucket=BUCKET, Key=file_key, Body=file_bytes)
            fileUrl = f"s3://{BUCKET}/{file_key}"

        # --- Build strict prompt for Bedrock ---
        submission_text = decoded_text if decoded_text else "(no file provided)"
        prompt = f"""
You are a strict senior code reviewer evaluating a project submission. 
Your role is to judge *relevance, completeness, correctness, and quality*.

TASK DESCRIPTION (what user was asked to do):
{description}

SUBMISSION CONTENT (what user submitted):
{submission_text}

Rules:
1. Be strict — if the submission is irrelevant, incomplete, or boilerplate, score low.
2. Consider relevance to the task, correctness of logic, clarity of code/comments, and effort.
3. Penalize submissions that ignore the task, are off-topic, or too short.
4. Reward originality, correctness, readability, and completeness.

Scoring Guide:
- 90–100 = Excellent: fully relevant, correct, complete, clean.
- 70–89  = Good: mostly relevant, minor mistakes or missing pieces.
- 50–69  = Fair: partial relevance, significant flaws or incompleteness.
- 30–49  = Poor: low relevance, major errors, weak effort.
- 0–29   = Irrelevant, spam, or empty submission.

Return ONLY valid JSON in this exact format:
{{
  "feedback": "short but strict constructive review highlighting strengths and weaknesses, noting relevance or irrelevance",
  "aiScore": integer 0-100
}}
"""

        payload = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 400,
            "messages": [{
                "role": "user",
                "content": [{"type": "text", "text": prompt}],
            }],
        }

        llm_resp = bedrock.invoke_model(
            modelId="anthropic.claude-3-sonnet-20240229-v1:0",
            contentType="application/json",
            accept="application/json",
            body=json.dumps(payload),
        )
        llm_result = json.loads(llm_resp["body"].read())
        completion = llm_result["content"][0]["text"].strip()

        # --- Parse LLM JSON strictly ---
        try:
            if "```json" in completion:
                completion = completion.split("```json")[1].split("```")[0].strip()
            parsed = json.loads(completion)

            feedback = str(parsed.get("feedback", "No feedback provided.")).strip()
            aiScore = int(parsed.get("aiScore", 0))
        except Exception:
            feedback = "Invalid AI response. Strict fallback applied."
            aiScore = 0

        # --- Clamp score ---
        aiScore = max(0, min(100, aiScore))

        # --- Save result ---
        item = {
            "userId": userId,
            "taskMilestone": f"{taskId}#{milestoneId}",
            "taskId": taskId,
            "milestoneId": milestoneId,
            "description": description,
            "fileUrl": fileUrl,
            "feedback": feedback,
            "aiScore": aiScore,
            "timestamp": datetime.utcnow().isoformat(),
        }
        table.put_item(Item=item)

        # --- Return response ---
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"feedback": feedback, "aiScore": aiScore}),
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)}),
        }
