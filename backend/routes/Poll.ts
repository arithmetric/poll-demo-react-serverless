import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { DynamodbClient, SqsClient } from "../lib/clients";
import { PollData, PollVoteMessage } from "../types";

// GET /poll/:id
// Returns a poll specified by its ID
export const PollGetById = async (req: Request, res: Response) => {
  const poll = await DynamodbClient.Get(req.params.id);
  if (!poll) {
    res.sendStatus(404);
    return;
  }
  res.send(poll);
};

// POST /poll
// Create a poll
export const PollCreate = async (req: Request, res: Response) => {
  const poll: PollData = req.body as PollData;
  poll.Id = uuidv4();
  const pollCreated = await DynamodbClient.Create<PollData>(poll);
  if (!pollCreated) {
    res.sendStatus(400);
    return;
  }
  res.send(poll);
};

// POST /poll/:id/vote
// Cast a vote on a poll
export const PollCastVote = async (req: Request, res: Response) => {
  const poll = await DynamodbClient.Get<PollData>(req.params.id);
  if (!poll) {
    res.sendStatus(404);
    return;
  }

  if (!req.body.OptionId || !poll.Options || !poll.Options.some((o) => o.Id === req.body.OptionId)) {
    res.sendStatus(400);
    return;
  }

  const message: PollVoteMessage = {
    Type: 'PollVote',
    PollId: req.params.id,
    OptionId: req.body.OptionId,
    DateVoted: (new Date()).toISOString(),
  };
  await SqsClient.SendMessage(message);

  res.status(201).send({ status: "ok" });
};
