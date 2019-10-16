const { readdir } = require('fs');

const BuildController = require('../BuildController');
const { mkdir } = require('../../helpers');

module.exports = class BuildsController {
  constructor(path) {
    this.path = path
  }

  async initNewBuild() {
    const nums = (await this.getAllDirs()).map(dir => parseInt(dir));
    let buildId;

    if (nums.length === 0) {
      buildId = 1;
    }
    else {
      buildId = Math.max(...nums) + 1;
    }

    await mkdir(`${this.path}/${buildId}`);

    return buildId;
  }

  get(buildId) {
    // no caching. New controller on every request
    return new BuildController(this.path, buildId);
  }

  getAllDirs() {
    return new Promise((resolve, reject) => {
      readdir(this.path, (err, dirs) => {
        if (err) {
          reject(new Error(err.message));
        }

        resolve(dirs.filter(dir => dir !== '.DS_Store'));
      });
    });
  }

  async getAll() {
    return (await this.getAllDirs()).map(dir => new BuildController(this.path, parseInt(dir)));
  }
}