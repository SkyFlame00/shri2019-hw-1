const express = require('express');
const bodyParser = require('body-parser');
const mountRoutes = require('./routes');
const helpers = require('./helpers');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
console.log(process.argv[2])
mountRoutes(
  app,
  {
    REPOS_PATH: process.argv[2],
    MAIN_BRANCH: 'master'
  },
  helpers
);

app.listen(8080, () => console.log('Listening on port 8080'));