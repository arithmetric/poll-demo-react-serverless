# Web App for the Poll Demo App

The Poll Demo App front end is a "single page" React web application built
with TypeScript and Vite.

When deployed to AWS, the static files are hosted in S3 and served with
CloudFront (for caching/CDN purposes).

## Local Development

This local environment quick start assumes you have the following installed:
- [nvm](https://github.com/nvm-sh/nvm) (or Node.js 18)

Run the web app with:
```
nvm use
npm i
npm run dev
```

Now you should be able to load the web app at: http://localhost:5000

## Building and Deploying

To deploy the backend services to an AWS environment, first build the web app
static assets:
```
VITE_API_BASE_URL="https://api.poll-demo-example.com" npm run build
```

Note: The API base URL must be specified at build time.

After building the assets, then deploy the AWS stack with the CDK package or
manually copy the build output to S3 and clear the CloudFront caches.
