const repoRouter = require('./repo');



const mountRoutes = (app, config, helpers) => {
  app.use((req, _, next) => {
    req.data.REPOS_PATH = config.REPOS_PATH;
    req.data.MAIN_BRANCH = config.MAIN_BRANCH;
    req.helpers = helpers;
    next();
  });

  app.use('/api/repos/:repositoryId', repoRouter);

  
};

module.exports = mountRoutes;