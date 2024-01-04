# Poll Demo App Backend

The backend for the Poll Demo App consists of a Node.js REST API and message
queue processor. The backend is hosted with a serverless stack in AWS. This
includes using Lambda for on-demand compute resources, DynamoDB for the primary
data store, and SQS for the message queue.

## API

The API allows the web app to create polls, fetch polls, and cast votes on
polls.

It exposes three API endpoints:

- `POST /poll` for creating polls
- `GET /poll/:id` for getting a poll
- `POST /poll/:id/vote` for casting a vote on a poll

The API is built with Express.js, which is wrapped with serverless-http to
support the Lambda runtime. When deployed to AWS, the API is exposed to the
internet with API Gateway (as an API management layer) and CloudFront (as a
caching and security layer).

## Queue Worker

The queue message processor performs actions when a queue message is received.
This allows decoupling certain processes from occuring during an API request.
In this case, when a vote is cast, the API handler does not record the vote
to the database, rather it sends a queue message with the vote information.
The processor then records the vote.

## Cloud Infrastructure

The backend uses AWS DynamoDB as the primary datastore. The schema for items in
the DynamoDB table are defined as a TypeScript type. (See `types/` in the
repository root.)

The backend uses AWS SQS for the message queue. The schema for messages is also
defined as a TypeScript type.

## Local Development

This local environment quick start assumes you have the following installed:
- [nvm](https://github.com/nvm-sh/nvm) (or Node.js 18)
- Docker
- [LocalStack](https://github.com/localstack/localstack#installation)

First, set up the local datastore and queue with LocalStack:
```
cd backend
localstack start -d
./scripts/create_table.sh
./scripts/create_queue.sh
```

Then, run the backend (use separate shells for each `npm run` command):
```
cd backend
nvm use
npm i
npm run dev-api
npm run dev-worker
```

## Building and Deploying

To deploy the backend services to an AWS environment, first build the backend
package with `npm run build`. Then deploy the AWS stack with the CDK package.

Note: Environment variables for the AWS environments do not need to be
specified at build time. CDK sets them in the Lambda function configuration.
