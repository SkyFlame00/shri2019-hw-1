module.exports = async (req, res) => {
  const { buildsController, agentsController } = req.controllers;
  const { status, buildId, stdout, stderr, startDate, endDate } = req.body;
  const build = buildsController.get(buildId);
  const agent = await build.getAgentInfo();
  
  const foundAgent = ~agentsController.agents.findIndex(a =>
    a && (a.hostname === agent.hostname && a.port === agent.port)
  );

  if (!foundAgent) {
    return res.json({
      error: true,
      code: 'AGENT_NOT_REGISTERED',
      message: 'Agent is not registered on this server'
    });
  }

  res.end();

  if (status === 0) {
    await build.setSuccess(stdout, startDate, endDate);
  } else {
    await build.setFail(stderr, startDate, endDate);
  }

  return agentsController.finishAgentWork(buildId)
}