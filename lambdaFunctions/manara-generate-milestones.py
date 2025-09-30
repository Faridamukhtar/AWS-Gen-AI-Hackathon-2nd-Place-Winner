import json
import boto3
import os

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ.get("DYNAMODB_TABLE", "manara-requests"))
bedrock_agent = boto3.client("bedrock-agent-runtime")

def lambda_handler(event, context):
    print(f"Event: {json.dumps(event)}")

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400"
    }

    try:
        method = event.get("requestContext", {}).get("http", {}).get("method")
        if method == "OPTIONS":
            return {"statusCode": 200, "headers": cors_headers, "body": ""}

        # ✅ requestId from query string
        query_params = event.get("queryStringParameters") or {}
        request_id = query_params.get("requestId")

        if not request_id:
            return {
                "statusCode": 400,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Missing requestId"})
            }

        # ✅ Get item from DynamoDB
        response = table.get_item(Key={"requestId": request_id})
        if "Item" not in response:
            return {
                "statusCode": 404,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Request not found"})
            }

        item = response["Item"]
        skills = item.get("skills", [])
        task = item.get("task", {})

        if not skills or not task:
            return {
                "statusCode": 400,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Invalid DynamoDB item schema"})
            }

        # ✅ Update status -> processing
        table.update_item(
            Key={"requestId": request_id},
            UpdateExpression="SET #status = :status",
            ExpressionAttributeNames={"#status": "status"},
            ExpressionAttributeValues={":status": "processing"}
        )

        # Build strict prompt for Bedrock
        skills_text = ", ".join([f"{s['skill']} ({s['level']})" for s in skills])
        prompt = f"""
You are an AI mentor. 
Input: learner skills = {skills_text}, task = {task.get('title')} - {task.get('description')}.  

Rules:
1. ALWAYS recommend Manara Knowledge Base (KB) courses first, if relevant.
2. ONLY if there are ZERO relevant KB courses, use external web resources.
3. Output MUST be strictly valid JSON, nothing else.
4. JSON format must be:

{{
  "milestones": {{
    "milestone1": {{
      "action": "string",
      "recommendedResources": ["string"]
    }},
    "milestone2": {{
      "action": "string",
      "recommendedResources": ["string"]
    }}
  }}
}}
"""

        try:
            bedrock_response = bedrock_agent.invoke_agent(
                agentId=os.environ.get("BEDROCK_AGENT_ID", "6AUAH5IBLX"),
                agentAliasId=os.environ.get("BEDROCK_AGENT_ALIAS_ID", "TSTALIASID"),
                sessionId=request_id,
                inputText=prompt
            )

            response_text = ""
            for event_chunk in bedrock_response.get("completion", []):
                if "chunk" in event_chunk and "bytes" in event_chunk["chunk"]:
                    response_text += event_chunk["chunk"]["bytes"].decode("utf-8")

            # ✅ Force JSON parsing
            try:
                if "```json" in response_text:
                    response_text = response_text.split("```json")[1].split("```")[0].strip()
                milestones_data = json.loads(response_text)
            except Exception:
                milestones_data = {
                    "milestones": {
                        "milestone1": {
                            "action": f"Fallback: Learn basics for {task.get('title')}",
                            "recommendedResources": ["Manara courses"]
                        }
                    }
                }

        except Exception as bedrock_error:
            print(f"Bedrock error: {str(bedrock_error)}")
            milestones_data = {
                "milestones": {
                    "milestone1": {
                        "action": f"Structured fallback for {task.get('title')}",
                        "recommendedResources": ["Manara courses"]
                    }
                }
            }

        # ✅ Save to DynamoDB
        table.update_item(
            Key={"requestId": request_id},
            UpdateExpression="SET #status = :status, #result = :result",
            ExpressionAttributeNames={"#status": "status", "#result": "result"},
            ExpressionAttributeValues={
                ":status": "completed",
                ":result": json.dumps(milestones_data)
            }
        )

        return {
            "statusCode": 200,
            "headers": {**cors_headers, "Content-Type": "application/json"},
            "body": json.dumps({
                "requestId": request_id,
                "status": "completed",
                "milestones": milestones_data["milestones"]
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {**cors_headers, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Internal server error", "details": str(e)})
        }
