import { json } from 'body-parser';
import cors from "cors";
import express from "express";

import { PollCastVote, PollCreate, PollGetById } from "./routes";

const app = express();

// Middleware for parsing JSON body data
app.use(json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`REQUEST ${(new Date()).toISOString()} ${req.method} ${req.url}${ req.body && Object.keys(req.body).length ? ' (with JSON body)' : ''}`);
  next();
});

// Middleware for CORS OPTIONS requests
app.use(cors());

// Routes
app.post('/poll', PollCreate);
app.get('/poll/:id', PollGetById);
app.post('/poll/:id/vote', PollCastVote);

// Catch all route
app.all('*', (req, res) => {
  res.sendStatus(404);
});

export default app;
