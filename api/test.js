// // this file is to be removed

// const fs = require('fs');
// const { join } = require('path');
// const { execFile } = require('child_process');

// const execute = (program, args, cwd) => {
//   return new Promise((resolve, reject) => {
//     execFile(program, args, { cwd }, (err, out) => {
//       if (err) {
//         reject(err);
//       }
//       else {
//         resolve(out);
//       }
//     });
//   });
// };

// execute('git', ['ls-tree', 'test', '--full-name'], '/Users/user/git-test')
//     .then(out => {
//       // console.log(out.split('\n'))
//       const files = out.split('\n')
//         .filter(str => str && str.length > 0)
//         .map(str => str.split('\t'))
//         .map(([str, path]) => {
//           const pathArr = path.split('/');
//           return [str.split(' ')[1], pathArr[pathArr.length - 1]];
//         })
//         .map(([type, fileName]) => ({ isRepository: type === 'tree', fileName }));

      
//       // console.log(files)
//     })
//   ;

const {spawn, exec} = require('child_process');

const git = spawn('git', ['clone', '/Users/user/shri-homework/api/test/innerRepo/testRepo2']);
// const git = spawn('git', ['show', 'diff']);

let error = false;

git.stderr.on('data', err => {
  error = true;
  console.log(err.toString())
})

git.on('uncaughtException', err => {
  console.log(err)
})

git.on('close', () => {
  if (error) return;
  console.log('success')
})

// try {
// exec('git clone /Users/user/shri-homework/api/test/innerRepo/testRepo2');
// }
// catch(e) {
//   console.log(e)
// }