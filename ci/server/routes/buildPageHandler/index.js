const { base, buildPage } = require('../../templates');

module.exports = async (req, res) => {
  const { buildsController } = req.controllers;
  const { buildId } = req.params;
  const build = buildsController.get(buildId);
  const { status, commitHash, buildCommand } = await build.getInfo();
  let content, hostname, port, startDate, endDate, agentInfo, datesInfo;

  switch(status) {
    case 'built':
      content = await build.getStdout();

      agentInfo = await build.getAgentInfo();
      hostname = agentInfo.hostname;
      port = agentInfo.port;

      datesInfo = await build.getDatesInfo();
      startDate = datesInfo.startDate;
      endDate = datesInfo.endDate;
      break;
    case 'building':
      content = 'Build command provided is being executed';

      agentInfo = await build.getAgentInfo();
      hostname = agentInfo.hostname;
      port = agentInfo.port;
      break;
    case 'queued':
      content = 'Build command is in the queue because all available agents are busy executing other commands';
      break;
    case 'error':
      content = await build.getStderr();

      agentInfo = await build.getAgentInfo();
      hostname = agentInfo.hostname;
      port = agentInfo.port;

      datesInfo = await build.getDatesInfo();
      startDate = datesInfo.startDate;
      endDate = datesInfo.endDate;
  }

  res.end(base(buildPage({
    status,
    buildId,
    commitHash,
    buildCommand,
    content,
    hostname,
    port,
    startDate,
    endDate
  })));
}