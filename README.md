# Poll Demo App with React and AWS Serverless

This repository includes the backend, frontend, and cloud infrastructure code
for a simple polling or voting app. The app allows any user to create a poll
that others can vote on. The app is simple and does not provide a way to find
polls (other than by direct URL) or to prevent multiple votes by one person.

The purpose of this is to demonstrate my "love stack" and the approach and
preferences I have for app prototypes or personal projects.

Some of the key characteristics are:

- Uniform TypeScript development environment for the frontend, backend, and
infrastructure automation.

- The backend consists of two parts: a REST API and a message queue system for
synchronous and asychronous processing.

- Document/non-relational datastore (AWS DynamoDB) with the schema defined
using TypeScript types shared between the backend and frontend.

- Entirely serverless and on-demand AWS cloud infrastructure with a deployment
fully automated with AWS CDK.

- Simple local environment set up that supports the full stack.

For more information see the `README.md` files in:
- `backend/` for the API and message queue system.
- `cdk/` for the cloud infrastructure automation.
- `types/` for the data types and schema definitions.
- `webapp/` for the frontend React web app.

## Local Quick Start

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

Then, start the web app:
```
cd webapp
nvm use
npm i
npm run dev
```

Now you should be able to load the web app at: http://localhost:5000
