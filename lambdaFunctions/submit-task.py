import json
import boto3
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
tasks_table = dynamodb.Table("company-tasks")  # ✅ single table only

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        userId = body["userId"]
        taskId = str(body["taskId"])
        totalScore = Decimal(str(body.get("totalScore", 0)))

        # ✅ Update task with new submission
        tasks_table.update_item(
            Key={"manara": taskId},
            UpdateExpression="""
                SET topSubmissions = list_append(if_not_exists(topSubmissions, :empty), :newsub)
            """,
            ExpressionAttributeValues={
                ":newsub": [{
                    "userId": userId,
                    "score": totalScore,
                    "submittedAt": datetime.utcnow().isoformat()
                }],
                ":empty": []
            },
            ReturnValues="UPDATED_NEW"
        )

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "Project successfully submitted to company",
                "totalScore": float(totalScore)
            })
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }
