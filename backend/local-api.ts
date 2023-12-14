import api from './api';

const port = process.env.PORT || 3000;

// For local environments, use the Express listener to run the API.
api.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
