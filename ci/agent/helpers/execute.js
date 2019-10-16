// const parse = require('shell-quote');

// const flatOps = args => {
//   return args.map(arg => {
//     if (typeof arg === 'object' && arg.op) {
//       return arg.op;
//     }
//   });
// }

// const removeObjects = args => args.filter(arg => typeof arg === 'object');

const spawn = require('child_process').spawn;

module.exports = (command, cwd) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, { shell: true, cwd });

    let result = '';
    let errData = '';

    process.stdout.on('data', data => {
      result += data;
    });

    process.stderr.on('data', data => {
      errData += data;
    });

    process.on('close', code => {
      if (code !== 0) {
        reject(new Error(errData));
      }

      resolve(result);
    });
  });
}