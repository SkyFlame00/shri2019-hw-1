const renderRootPage = require('./renderRootPage');

module.exports = async (req, res) => {
  const { buildsController } = req.controllers;
  const rootPage = await renderRootPage(buildsController);
  res.end(rootPage);
}