import { AttributeValue, DynamoDBClient, GetItemCommand, PutItemCommand, ReturnValue, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { DataTypes } from "../../../types";

const tableName = process.env.TABLE_NAME ?? "PollDemo-Local";
const endpoint = process.env.TABLE_NAME ? undefined : "http://localhost:4566";

const keyField = 'Id';

const client = new DynamoDBClient({
  endpoint,
});

export class DynamodbClient {
  static async Get<T extends DataTypes>(Id: string, consistentRead?: boolean): Promise<T | null> {
    const input = {
      TableName: tableName,
      Key: {
        [keyField]: {
          S: Id,
        },
      },
      ConsistentRead: !!consistentRead,
    };
    const command = new GetItemCommand(input);
    const response = await client.send(command);
    if (!response.Item) return null;
    return unmarshall(response.Item) as T;
  }

  static async Create<T extends DataTypes>(item: T): Promise<boolean> {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
      ConditionExpression: `attribute_not_exists(${keyField})`,
    });
    const response = await client.send(command);
    return response.$metadata.httpStatusCode === 200;
  }

  static async Update<T extends DataTypes>(item: T, allowCreate: boolean = false): Promise<T | null> {
    const updateExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, AttributeValue> = {};
    Object.entries(item).forEach(([key, value]) => {
      if (key === keyField) return;
      updateExpressionParts.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = marshall(value as unknown, { convertClassInstanceToMap: true, convertTopLevelContainer: true });
    });
    const command = new UpdateItemCommand({
      TableName: tableName,
      Key: { [keyField]: { S: item[keyField] }},
      UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: ReturnValue.ALL_NEW,
      ...(!allowCreate ? { ConditionExpression: "attribute_exists(Id)" } : null),
    });
    const response = await client.send(command);
    return response.Attributes ? unmarshall(response.Attributes) as T : null;
  }

  // static async Delete(item: DataTypes): Promise<boolean> {
  // }
}
