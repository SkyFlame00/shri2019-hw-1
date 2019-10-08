const fs = require('fs');
const { join } = require('path');
const { execFile } = require('child_process');

const isRepo = (dirPath) => {
  return fs.existsSync(join(dirPath, '.git'));
};

const getRepos = async (path) => {
  return (await fs.promises.readdir(path, { withFileTypes: true }))
    .filter(entity => entity.isDirectory() && isRepo(join(path, entity.name)))
    .map(entity => entity.name)
  ;
};

const execute = (program, args, cwd) => {
  return new Promise((resolve, reject) => {
    execFile(program, args, { cwd }, (err, out) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(out);
      }
    });
  });
};

const handleError = (res, message) => {
  return err => {
    if (!message) {
      switch(err.code) {
        case 'ENOENT':
          message = 'Provided directory does not exist';
          break;
        default:
          message = err.message;
          break;
      }
    }

    return res.status(404).json({
      error: true,
      message
    });
  }
}

module.exports = {
  isRepo,
  getRepos,
  execute,
  handleError
};