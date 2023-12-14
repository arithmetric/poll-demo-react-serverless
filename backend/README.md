
AWS Lambda powered API and worker backend for the Poll Demo

This package includes two parts: an HTTP REST API and a processor for a message queue.

The API allows the web app uses to create polls, fetch polls, and cast votes on polls. The API is built on Express.js, which can be wrapped with serverless-http to be deployed easily to Lambda.

The processor performs actions based on queue messages. This allows decoupling some processing from the API request. In this case, when a vote is cast, the API handler does not record the vote to the database, and instead sends a queue message with the vote information. The processor then records the vote.

The database is Dynamodb, and while it is agnostic on the structure of the table items, the schema for table items is defined as a Typescript interface and applied when loading or creating data.

For local development, run the services:
- AWS_REGION=us-east-1 AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test npm run dev
- AWS_REGION=us-east-1 AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test ./node_modules/.bin/nodemon local-worker.ts

To build and deploy these services, run `npm run build` in this package's directory. Then update the AWS stack with the CDK package.


