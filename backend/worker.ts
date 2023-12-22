import { Message } from '@aws-sdk/client-sqs';

import { DynamodbClient } from './lib/clients';
import { BaseMessage, PollData, PollVoteMessage } from '../types';

export class Worker {
  static async ProcessQueueMessage(m: Message): Promise<boolean> {
    let message: BaseMessage;
    try {
      if (!m.Body) throw new Error("SQS message body is empty.");
      message = JSON.parse(m.Body);
    } catch (err) {
      console.log(`Worker.ProcessQueueMessage caught error while parsing SQS message: ${JSON.stringify(err)}`);
      return true;
    }

    switch (message.Type) {
      case 'PollVote': {
        console.log(`Worker.ProcessQueueMessage handling PollVote message.`);
        const pvm = message as PollVoteMessage;
        const poll = await DynamodbClient.Get<PollData>(pvm.PollId, true);
        if (poll) {
          if (!poll.Votes) poll.Votes = {};
          if (!poll.Votes[pvm.OptionId]) poll.Votes[pvm.OptionId] = 0;
          poll.Votes[pvm.OptionId] += 1;
          poll.DateLastVote = (new Date()).toISOString();
          // TODO: Only update the fields that change.
          await DynamodbClient.Update<PollData>(poll);
        }
        return true;
      }
    }

    console.log(`Worker.ProcessQueueMessage received message with unknown type: ${JSON.stringify(message)}`);
    return true;
  }
}
