const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const mountRoutes = require('../routes');
const { hostname } = require('../config');

const agent = express();

agent.use(bodyParser.json());
agent.use(bodyParser.urlencoded({ extended: false }))

const agents = [];

agent.use((req, res, next) => {
  req.agents = agents;
  next();
});

mountRoutes(agent);

module.exports = (port, serverUrl, closeConnectionMs) => {
  const agentServer = agent.listen(port);
  
  agents.push({ agentServer, port });

  axios.post(
    serverUrl,
    { hostname, port }
  ).then(() => {
    console.log(`Agent on ${hostname}:${port} is run. Server has been notified`);
  })
  .catch(err => {
    console.log(`Agent could not establish the connection with server. Error message is: "${err.message}". Agent will be shutted down...`);
    agentServer.close();
    console.log(`Agent has been shutted down (port: ${port})`);
  });

  // Only for test purposes
  if (closeConnectionMs) {
    setTimeout(() => {
      console.log(`Agent has been shutted down (port: ${port}) on test case`);
      agentServer.close();
    }, closeConnectionMs);
  }
}