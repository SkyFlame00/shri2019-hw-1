const { writeFile, readFile } = require('fs');

module.exports = class BuildController {
  constructor(path, buildId) {
    this.path = path;
    this.buildId = buildId;
  }

  writeBuildFile(fileName, content) {
    return new Promise((resolve, reject) => {
      writeFile(
        `${this.path}/${this.buildId}/${fileName}`,
        content,
        err => {
          if (err) {
            reject(new Error(err.message));
          }

          resolve();
        }
      );
    });
  }

  readBuildFile(fileName) {
    return (new Promise((resolve, reject) => {
      readFile(
        `${this.path}/${this.buildId}/${fileName}`,
        (err, content) => {
        if (err) {
          reject(new Error(err));
        }

        resolve(
          (content && content.toString()) || ''
        );
      });
    })).catch(() => '');
  }

  writeInfo(content) {
    return this.writeBuildFile('info.txt', content);
  }

  writeAgent({ hostname, port }) {
    return this.writeBuildFile('agent.txt', `${hostname}\n${port}`);
  }

  writeDate(startDate, endDate) {
    return this.writeBuildFile('dates.txt', `${startDate}\n${endDate}`);
  }

  setStdout(content) {
    return this.writeBuildFile('stdout.txt', content);
  }

  setStderr(content) {
    return this.writeBuildFile('stderr.txt', content);
  }

  getInfo() {
    return this.readBuildFile('info.txt')
      .then(content => {
        const [commitHash, buildCommand, status] = content.split('\n');
    
        return {
          buildId: this.buildId,
          commitHash,
          buildCommand,
          status
        };
      })
  }

  getAgentInfo() {
    return this.readBuildFile('agent.txt')
      .then(content => {
        const [ hostname, port ] = content.split('\n');
        return { hostname, port: parseInt(port) };
      });
  }

  getDatesInfo() {
    return this.readBuildFile('dates.txt')
      .then(content => {
        const [ startDate, endDate ] = content.split('\n');
        return { startDate, endDate }
      })
  }

  async setSuccess(stdout, startDate='', endDate='') {
    const { commitHash, buildCommand } = await this.getInfo();
    await this.writeInfo(`${commitHash}\n${buildCommand}\nbuilt`);
    await this.writeDate(startDate, endDate);
    return this.setStdout(stdout);
  }

  async setFail(stderr, startDate='', endDate='') {
    const { commitHash, buildCommand } = await this.getInfo();
    await this.writeInfo(`${commitHash}\n${buildCommand}\nerror`);
    await this.writeDate(startDate, endDate);
    return this.setStderr(stderr);
  }

  getStdout() {
    return this.readBuildFile('stdout.txt');
  }

  getStderr() {
    return this.readBuildFile('stderr.txt');
  }
  
}