const app = require('./app')();
const mountRoutes = require('./routes');
const helpers = require('./helpers');

mountRoutes(
  app,
  {
    REPOS_PATH: process.argv[2],
    MAIN_BRANCH: 'master'
  },
  helpers
);

app.listen(8080, () => console.log('Listening on port 8080'));