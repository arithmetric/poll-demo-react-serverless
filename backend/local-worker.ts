import { DeleteMessageBatchCommand, DeleteMessageBatchRequestEntry, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { Worker } from './worker';

const queueUrl = "http://localhost:4566/000000000000/PollQueue-Local";

// For local environments, poll the Localstack SQS queue for messages.
const client = new SQSClient({
  endpoint: "http://localhost:4566"
});

const receive = async () => {
  const input = {
    QueueUrl: queueUrl,
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
      await client.send(deleteCommand);
    }
  }
};

const loop = () => {
  receive().then(() => setTimeout(loop, 5000));
};

loop();

console.log('Polling for messages...');
