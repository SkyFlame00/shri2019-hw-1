const renderRootPage = require('./renderRootPage');

module.exports = async (req, res) => {
  const { agentsController, buildsController } = req.controllers;
  const { commitHash, buildCommand } = req.body;
  const buildId = await buildsController.initNewBuild();
  await agentsController.runTask({commitHash, buildCommand, buildId});
  const rootPage = await renderRootPage(buildsController);
  res.end(rootPage);
}