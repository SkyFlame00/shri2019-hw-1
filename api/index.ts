import { Application } from 'express';

import createAppInstance from './app';
import mountRoutes from './routes';
import * as helpers from './helpers';

const app: Application = createAppInstance();

mountRoutes(
  app,
  {
    REPOS_PATH: process.argv[2],
    MAIN_BRANCH: 'master'
  },
  helpers
);

app.listen(8080, () => console.log('Listening on port 8080'));