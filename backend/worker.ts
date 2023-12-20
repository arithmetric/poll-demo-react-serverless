import { Message } from '@aws-sdk/client-sqs';

import { DynamodbClient } from './lib/clients';
import { BaseMessage, PollData, PollVoteMessage } from '../types';

export class Worker {
  static async ProcessQueueMessage(m: Message): Promise<boolean> {
    console.log('ProcessQueueMessage', m);

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
        const pvm = message as PollVoteMessage;
        console.log('processing poll vote message', pvm);
        const poll = await DynamodbClient.Get<PollData>(pvm.PollId, true);
        console.log('orig poll', poll);
        if (poll) {
          // TODO only update what's changing...
          if (!poll.Votes) poll.Votes = {};
          if (!poll.Votes[pvm.OptionId]) poll.Votes[pvm.OptionId] = 0;
          poll.Votes[pvm.OptionId] += 1;
          poll.DateLastVote = (new Date()).toISOString();
          console.log('trying to update', poll);
          const updatedPoll = await DynamodbClient.Update<PollData>(poll);
          console.log('updated poll', updatedPoll);
        }
        return true;
      }
    }

    console.log('unknown message type', message);
    return true;
  }
}
