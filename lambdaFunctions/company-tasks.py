# lambda_company.py
import json
import boto3
from decimal import Decimal

db = boto3.resource("dynamodb")
table = db.Table("company-tasks")

# Custom encoder for DynamoDB Decimals
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)   # No fractional part
            return float(obj)     # Keep decimal part
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    method = event.get("httpMethod")

    if method == "POST":
        body = json.loads(event.get("body", "{}"))
        # Store directly into DynamoDB
        table.put_item(Item=body)
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": "Task saved"})
        }

    if method == "GET":
        result = table.scan()
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps(result.get("Items", []), cls=DecimalEncoder)
        }

    return {
        "statusCode": 405,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": {"Method not allowed: ": method}
    }
