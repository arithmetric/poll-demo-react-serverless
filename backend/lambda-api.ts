import serverless from 'serverless-http';

import api from './api';

// Run the API in Lambda environments using the serverless-http wrapper.
export const handler = serverless(api);
