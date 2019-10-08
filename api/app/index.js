const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  return app;
}