export interface BaseData {
  Id: string;
  DateCreated: string;
  DateUpdated: string;
}

export interface Poll extends BaseData {
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
