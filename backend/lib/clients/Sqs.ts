import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import { BaseMessage } from "../../../types";

const queueUrl = process.env.QUEUE_URL ?? "http://localhost:4566/000000000000/PollQueue-Local";
const endpoint = process.env.QUEUE_URL ? undefined : "http://localhost:4566";

const client = new SQSClient({
  endpoint,
});

export class SqsClient {
  static async SendMessage(message: BaseMessage): Promise<boolean> {
    const input = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    };
    const command = new SendMessageCommand(input);
    const response = await client.send(command);
    return response && !!response.MessageId;
  }
}
