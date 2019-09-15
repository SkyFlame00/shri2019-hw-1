const express = require('express');
const bodyParser = require('body-parser');
const mountRoutes = require('./routes');
const helpers = require('./helpers');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

mountRoutes(
  app,
  {
    REPOS_PATH: process.argv[2],
    MAIN_BRANCH: 'master'
  },
  helpers
);

app.listen(8080, () => console.log('Listening on port 8080'));