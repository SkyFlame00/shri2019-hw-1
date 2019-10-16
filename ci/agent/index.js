const rimraf = require('rimraf');

const createAgent = require('./createAgent');
const { agents, serverPort } = require('./config');
const { mkdir } = require('./helpers');

const serverUrl = `http://localhost:${serverPort}/notify_agent`;

rimraf('./buildRepos', err => {
  if (err) {
    console.log(err);
    return;
  }

  mkdir('./buildRepos').then(init);
})

function init() {
  agents.forEach(agent => createAgent(agent.port, serverUrl, agent.closeConnectionMs));
}