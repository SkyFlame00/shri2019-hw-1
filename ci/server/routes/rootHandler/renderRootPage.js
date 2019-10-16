const { sortBuilds } = require('../../helpers');
const { base, form, table } = require('../../templates');

module.exports = async (buildsController) => {
  return buildsController.getAll()
    .then(builds => Promise.all(builds.map(build => build.getInfo())))
    .then(builds => builds.sort(sortBuilds))
    .then(builds => base([
      form(),
      table(builds)
    ]));
}