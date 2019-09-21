const repoRouter = require('./repo');
const otherRouter = require('./other');

const mountRoutes = (app, config, helpers) => {
  app.use((req, _, next) => {
    req.data = {
      REPOS_PATH: config.REPOS_PATH,
      MAIN_BRANCH: config.MAIN_BRANCH
    }
    req.helpers = helpers;
    next();
  });
  app.use('/api/repos/:repositoryId', repoRouter);
  app.use(otherRouter);
};

module.exports = mountRoutes;