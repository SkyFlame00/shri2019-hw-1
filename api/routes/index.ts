import { Application } from 'express';
import repoRouter from './repo';
import otherRouter from './other';

export default function mountRoutes(app: Application, config: ArcanumAPI.RoutesConfig, helpers: Express.RequestHelpers): void {
  app.use((req, res, next) => {
    req.data = {
      REPOS_PATH: config.REPOS_PATH,
      MAIN_BRANCH: config.MAIN_BRANCH
    }
    req.helpers = helpers;
    next();
  });
  app.use('/api/repos/:repositoryId', repoRouter);
  app.use(otherRouter);
}