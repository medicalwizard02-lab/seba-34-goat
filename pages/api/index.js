// Root API route handler
const app = require('../../api/index');

export default app;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
