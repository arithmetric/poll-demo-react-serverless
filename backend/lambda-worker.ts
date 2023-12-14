import { SQSBatchResponse, SQSEvent } from 'aws-lambda';
import { Message, MessageAttributeValue } from '@aws-sdk/client-sqs';
import { fromBase64 } from '@smithy/util-base64';

import { Worker } from './worker';

// Lambda handler for the Worker function.
export const handler = async (event: SQSEvent): Promise<SQSBatchResponse | void> => {
  await Promise.all(event.Records.map((r) => {
    const m: Message = {
      MessageId: r.messageId,
      ReceiptHandle: r.receiptHandle,
      MD5OfBody: r.md5OfBody,
      Body: r.body,
      Attributes: r.attributes,
      MD5OfMessageAttributes: '',
      MessageAttributes:
        Object.keys(r.messageAttributes).reduce((obj: Record<string, MessageAttributeValue>, key: string) => {
          const source = r.messageAttributes[key];
          obj[key] = {
            StringValue: source.stringValue,
            BinaryValue: source.binaryValue ? fromBase64(source.binaryValue) : undefined,
            StringListValues: source.stringListValues,
            BinaryListValues: source.binaryListValues ? source.binaryListValues.map(fromBase64) : undefined,
            DataType: source.dataType,
          };
          return obj;
        }, {}),
    };
    return Worker.ProcessQueueMessage(m);
  }));
};
