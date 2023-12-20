export type MessageTypes = BaseMessage | PollVoteMessage;

export interface BaseMessage {
  Type: string;
}

export interface PollVoteMessage extends BaseMessage {
  Type: 'PollVote';
  PollId: string;
  OptionId: string;
  DateVoted: string;
}
