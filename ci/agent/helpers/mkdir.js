const { mkdir } = require('fs');

module.exports = path => {
  return new Promise((resolve, reject) => {
    mkdir(path, { recursive: true }, err => {
      if (err) {
        reject(new Error(err.message));
      }

      resolve();
    });
  });
}