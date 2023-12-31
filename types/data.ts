export type DataTypes = BaseData | PollData;

export interface BaseData {
  Id: string;
  DateCreated: string;
  DateUpdated: string;
}

export interface PollData extends BaseData {
  DateLastVote?: string;
  Description?: string;
  Options?: PollOption[];
  Question: string;
  TotalVotes?: number;
  Votes?: { [Id: string]: number; };
}

export interface PollOption {
  Id: string;
  ImageUrl?: string;
  Text?: string;
}
