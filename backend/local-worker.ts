import { DeleteMessageBatchCommand, DeleteMessageBatchRequestEntry, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { Worker } from './worker';

const queueUrl = "http://localhost:4566/000000000000/PollQueue";

// For local environments, poll the Localstack SQS queue for messages.
const client = new SQSClient({
  endpoint: "http://localhost:4566"
});

const receive = async () => {
  const input = { // ReceiveMessageRequest
    QueueUrl: queueUrl,
    // AttributeNames: [ // AttributeNameList
    //   "All" || "Policy" || "VisibilityTimeout" || "MaximumMessageSize" || "MessageRetentionPeriod" || "ApproximateNumberOfMessages" || "ApproximateNumberOfMessagesNotVisible" || "CreatedTimestamp" || "LastModifiedTimestamp" || "QueueArn" || "ApproximateNumberOfMessagesDelayed" || "DelaySeconds" || "ReceiveMessageWaitTimeSeconds" || "RedrivePolicy" || "FifoQueue" || "ContentBasedDeduplication" || "KmsMasterKeyId" || "KmsDataKeyReusePeriodSeconds" || "DeduplicationScope" || "FifoThroughputLimit" || "RedriveAllowPolicy" || "SqsManagedSseEnabled",
    // ],
    // MessageAttributeNames: [ // MessageAttributeNameList
    //   "STRING_VALUE",
    // ],
    // MaxNumberOfMessages: Number("int"),
    // VisibilityTimeout: Number("int"),
    // WaitTimeSeconds: Number("int"),
    // ReceiveRequestAttemptId: "STRING_VALUE",
  };
  const command = new ReceiveMessageCommand(input);
  const response = await client.send(command);
  
  console.log(`Received ${response.Messages?.length || 0} messages from SQS`);

  if (response.Messages) {
    const deleteEntries: (DeleteMessageBatchRequestEntry | undefined)[] = await Promise.all(response.Messages.map(async (m) => {
      const res = await Worker.ProcessQueueMessage(m);
      if (res) {
        return {
          Id: m.MessageId,
          ReceiptHandle: m.ReceiptHandle,
        };
      }
    }));

    const deleteInput = {
      QueueUrl: queueUrl,
      Entries: deleteEntries.filter((e) => !!e) as DeleteMessageBatchRequestEntry[],
    };
    if (deleteInput.Entries.length) {
      const deleteCommand = new DeleteMessageBatchCommand(deleteInput);
      const deleteResponse = await client.send(deleteCommand);
      console.log('delete response', deleteResponse);
    }
  }
};

const loop = () => {
  receive().then(() => setTimeout(loop, 5000));
};

loop();

console.log('Polling for messages...');
