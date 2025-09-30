import json
import boto3
import uuid
from datetime import datetime
import os

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ.get("DYNAMODB_TABLE", "manara-requests"))

def lambda_handler(event, context):
    print(f"Event: {json.dumps(event)}")

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400"
    }

    try:
        method = event.get("requestContext", {}).get("http", {}).get("method")
        if method == "OPTIONS":
            return {"statusCode": 200, "headers": cors_headers, "body": ""}

        body = event.get("body", "{}")
        if isinstance(body, str):
            data = json.loads(body)
        else:
            data = body

        skills = data.get("skills")
        task = data.get("task")

        # ✅ Validate schema
        if not isinstance(skills, list) or not isinstance(task, dict):
            return {
                "statusCode": 400,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Invalid request schema"})
            }

        request_id = str(uuid.uuid4())

        # ✅ Save to DynamoDB
        item = {
            "requestId": request_id,
            "skills": skills,
            "task": task,
            "status": "pending",
            "result": {},
            "timestamp": datetime.utcnow().isoformat()
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "headers": {**cors_headers, "Content-Type": "application/json"},
            "body": json.dumps({
                "requestId": request_id,
                "message": "Request saved successfully",
                "skills": skills,
                "task": task
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {**cors_headers, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Internal server error", "details": str(e)})
        }
