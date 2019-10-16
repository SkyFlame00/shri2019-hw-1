const axios = require('axios');
const tcpp = require('tcp-ping');

const { repoLoc } = require('../../config');
const BuildController = require('../BuildController');

module.exports = class Agents {
  constructor(buildsController) {
    this.buildsController = buildsController;
    this.agents = [];
    this.tasksQueue = [];
    this.intervalPeriodMs = 5000;
    this.intervalId = this.pingAgents();
  }

  addAgent({ hostname, port }) {
    this.agents.push({
      hostname,
      port,
      isBusy: false,
      workingBuildId: undefined
    });
  }

  runTask({commitHash, buildCommand, buildId}, defaultAgent) {
    return new Promise((resolve) => {
      // Agent is either null or an object containing some info
      if (this.agents.filter(a=>!!a).length === 0) {
        const build = this.buildsController.get(buildId);

        return Promise.all([
          build.writeInfo(`${commitHash}\n${buildCommand}\nerror`),
          build.setStderr('No agents available')
        ]).then(resolve);
      }

      let agent;

      if (defaultAgent) {
        // Look for the agent anyway because defaultAgent is a different object
        // from those contained in this.agents array
        const agentIdx = this.agents.findIndex(
          agent => agent && agent.hostname === defaultAgent.hostname && agent.port === defaultAgent.port
        );
        agent = (agentIdx > -1) && this.agents[agentIdx];
      } else {
        const agentIdx = this.agents.findIndex(agent => agent && !agent.isBusy);
        agent = (agentIdx > -1) && this.agents[agentIdx];
      }

      const task = { commitHash, buildCommand, buildId, repoLoc };

      if (agent) {
        axios.post(
          `http://${agent.hostname}:${agent.port}/build`,
          task
        ).then(() => {
          agent.isBusy = true;
          agent.workingBuildId = buildId;
          // console.log('wd id',agent.workingBuildId)
          const build = this.buildsController.get(buildId);

          Promise.all([
            build.writeInfo(`${commitHash}\n${buildCommand}\nbuilding`),
            build.writeAgent(agent)
          ]).then(resolve);
        })
        .catch(() => {
          console.log(`The connection was lost between server and agent on ${agent.hostname}:${agent.port}. Removing the agent...`);
          const agentIdx = this.agents.findIndex(a => a && (a.hostname === agent.hostname && a.port === agent.port));
          this.agents.splice(agentIdx, 1, null);
          resolve(this.runTask(...task));
        });
      } else {
        this.tasksQueue.push(task);
        resolve(this.buildsController.get(buildId).writeInfo(
          `${commitHash}\n${buildCommand}\nqueued`
        ));
      }
    });
  }

  async finishAgentWork(buildId) {
    const build = new BuildController(this.buildsController.path, buildId);
    const agent = await build.getAgentInfo();

    if (this.tasksQueue.length === 0) {
      const foundAgent = this.agents.find(a => a && (a.hostname === agent.hostname && a.port === agent.port));
      foundAgent.isBusy = false;
      foundAgent.workingBuildId = undefined;
    } else {
      this.runTask(this.tasksQueue.splice(0, 1)[0], agent);
    }
  }

  pingAgents() {
    return setInterval(() => {
      this.agents.filter(a=>!!a).forEach((agent) => {
        const { hostname, port, isBusy, workingBuildId } = agent;

        tcpp.probe(hostname, port, (err, isAlive) => {
          if (err) {
            console.log(err);
            return;
          }

          if (isAlive) {
            return;
          }

          console.log(`The connection was lost between server and agent on ${hostname}:${port}. Removing the agent...`);

          const agentIdx = this.agents.findIndex(a => a === agent);
          this.agents.splice(agentIdx, 1, null);

          if (isBusy) {
            this.buildsController.get(workingBuildId).setFail('The connection was lost');
          }

          if (this.tasksQueue.length > 0 && this.agents.filter(a=>!!a).length === 0) {
            this.tasksQueue.forEach(({commitHash, buildCommand, buildId}) => {
              const build = this.buildsController.get(buildId);
              build.writeInfo(`${commitHash}\n${buildCommand}\nerror`);
              build.setStderr('No agents available');
            });

            this.tasksQueue = [];
          }
        });
      });
    }, this.intervalPeriodMs);
  }
}