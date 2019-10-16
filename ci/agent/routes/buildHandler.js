const { resolve } = require('path');
const axios = require('axios');
const rimraf = require('rimraf');

const { execute, mkdir } = require('../helpers');
const { hostname, serverPort } = require('../config');

const handleResponse = (req, port) => {
  return res => {
    const { error, code, message } = res.data;
    
    if (!error) {
      return;
    }

    const { agents } = req;

    console.log(`Invalid communication between agent and server. Error message is: "${message}". Agent will be shutted down...`);

    const agentIdx = agents.findIndex(agent => agent.port === port);
    const agent = agents.splice(agentIdx, 1)[0];
    agent.agentServer.close();

    console.log('Agent has been shutted down');
  }
}

const handlePostError = (req, port) => {
  return err => {
    const { agents } = req;

    console.log(`Agent could not reach the server. Error code: "${err.message}". Agent will be shutted down...`);

    const agentIdx = agents.findIndex(agent => agent.port === port);
    const agent = agents.splice(agentIdx, 1)[0];
    agent.agentServer.close();

    console.log('Agent has been shutted down');
  }
}

module.exports = (req, res) => {
  const {
    buildId,
    repoLoc,
    commitHash,
    buildCommand
  } = req.body;
  const port = req.socket.localPort;

  res.end();

  const serverUrl = `http://${hostname}:${serverPort}`;
  const repoDirname = 'repository';
  const buildsPath = resolve(__dirname, '..', 'buildRepos');
  const buildPath = resolve(buildsPath, buildId.toString());
  const repoPath = resolve(buildPath, repoDirname);
  let startDate, endDate;

  mkdir(buildPath)
    .then(() => execute(`git clone ${repoLoc} ${repoDirname}`, buildPath))
    .then(() => execute(`git checkout ${commitHash}`, repoPath))
    .then(() => {
      startDate = new Date();
      return execute(buildCommand, repoPath);
    })
    .then(data => {
      endDate = new Date();
      axios.post(`${serverUrl}/notify_build_result`, {
        status: 0,
        buildId,
        stdout: data,
        startDate,
        endDate
      })
      .then(handleResponse(req, port))
      .catch(handlePostError(req, port));
    })
    .catch(err => {
      axios.post(`${serverUrl}/notify_build_result`, {
        status: 2,
        buildId,
        stderr: err.message,
        startDate,
        endDate
      })
      .then(handleResponse(req, port))
      .catch(handlePostError(req, port));
    })
    .then(() => rimraf(buildPath, (err) => err && console.log(err)));
}