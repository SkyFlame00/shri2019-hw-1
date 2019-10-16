const express = require('express');
const bodyParser = require('body-parser');
const { resolve } = require('path');

const { port } = require('./config');
const { rootHandler, notifyBuildResultHandler, notifyAgent, buildPageHandler } = require('./routes');
const { AgentsController, BuildsController } = require('./controllers');
const { mkdir } = require('./helpers');

mkdir('./builds').then(init);

function init() {
  const app = express();  
  const buildsPath = resolve(__dirname, 'builds');
  const buildsController = new BuildsController(buildsPath);
  const agentsController = new AgentsController(buildsController);
  const setWaitingInstancesToBeErrors = async () => {
    const waitingStatuses = ['building', 'queued'];
    const failMessage = 'The connection was lost';
  
    buildsController.getAll()
      .then(builds => Promise.all(builds.map(async (build) => ({
        instance: build,
        status: (await build.getInfo()).status
      }))))
      .then(builds => builds.filter(build => waitingStatuses.includes(build.status)))
      .then(builds => builds.forEach(build => build.instance.setFail(failMessage)));
  }
  
  setWaitingInstancesToBeErrors()
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use((req, res, next) => {
    req.controllers = {
      buildsController,
      agentsController
    };
    next();
  });
  
  app.get('/', rootHandler.get);
  app.post('/', rootHandler.post);
  app.post('/notify_agent', notifyAgent);
  app.post('/notify_build_result', notifyBuildResultHandler);
  app.get('/build/:buildId', buildPageHandler);
  
  app.listen(port, () => console.log(`Listening on port ${port}`));
}
