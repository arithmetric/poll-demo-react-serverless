# Poll Demo App with React and AWS Serverless

This repository includes the backend, frontend, and cloud infrastructure code
for a simple polling or voting app. The app allows any user to create a poll
that others can vote on. The app is simple and does not provide a way to find
polls (other than by direct URL) or to prevent multiple votes by one person.

The backend is a Node.js REST API and message queue worker. It is powered by a
serverless stack in AWS. This includes using Lambda for on-demand compute
resources, DynamoDB for the primary data store, and SQS for the message queue.
For more information, see the README in `backend/`.

The frontend is a React JavaScript web application. It is hosted in S3 and
served with CloudFront. For more information, see the README in `webapp/`.

The cloud infrastructure is deployed with CDK. For more information, see the
README in `cdk/`.
