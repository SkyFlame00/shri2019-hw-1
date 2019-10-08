const { Router } = require('express');
const { spawn } = require('child_process');
const { join } = require('path');
const rimraf = require('rimraf');

const repoRouter = Router({ mergeParams: true });
let repositoryId,
    repoPath,
    REPOS_PATH,
    MAIN_BRANCH,
    getRepos,
    execute,
    handleError;

const getDefaultRepos = () => getRepos(REPOS_PATH);

const processFilesString = out => {
  return out.split('\n')
    .filter(str => str && str.length > 0)
    .map(str => str.split('\t'))
    .map(([str, path]) => {
      const pathArr = path.split('/');
      return [str.split(' ')[1], pathArr[pathArr.length - 1]];
    })
    .map(([type, fileName]) => ({ isDir: type === 'tree', fileName }));
}

repoRouter.use(async (req, res, next) => {
  repositoryId = req.params.repositoryId;
  REPOS_PATH = req.data.REPOS_PATH;
  MAIN_BRANCH = req.data.MAIN_BRANCH;
  execute = req.helpers.execute;
  getRepos = req.helpers.getRepos;
  handleError = req.helpers.handleError;

  let repos;

  try {
    repos = await getDefaultRepos();
  } catch(e) {
    return handleError(res)(e);
  }
  
  if (!repos.find(repoId => repoId === repositoryId))
    return handleError(res, 'Specified repository does not exist in this directory')();
  repoPath = join(REPOS_PATH, repositoryId);
  next();
});

repoRouter.get('/', (_, res) => {
  execute('git', ['ls-tree', MAIN_BRANCH, '--full-name'], repoPath)
    .then(out => {
      const entries = processFilesString(out);
      return res.status(200).json(entries);
    })
    .catch(handleError(res));
});

repoRouter.delete('/', (_, res) => {
  rimraf(`${REPOS_PATH}/${repositoryId}`, err => {
    if (err) {
      return handleError(res)(err);
    }

    return res.status(200).end();
  });
});

repoRouter.get('/tree', (_, res) => {
  return handleError(res, 'You did not provide the branch name')();
});

repoRouter.get('/tree/:commitHash', async (req, res) => {
  const { commitHash } = req.params;

  execute('git', ['ls-tree', commitHash, '--full-name'], repoPath)
    .then(out => {
      const entries = processFilesString(out);
      return res.status(200).json(entries);
    })
    .catch(handleError(res));
});

repoRouter.get('/tree/:commitHash/:path([^ ]+)', async (req, res) => {
  const { commitHash, path: pathRaw } = req.params;
  const path = pathRaw[pathRaw.length - 1] === '/' ? pathRaw : pathRaw + '/';

  execute('git', ['ls-tree', '--full-name', `${commitHash}:${path}`], repoPath)
    .then(out => {
      const entries = processFilesString(out);
      return res.status(200).json(entries);
    })
    .catch(handleError(res));
});

repoRouter.get('/blob/:commitHash/:pathToFile([^ ]+)', (req, res) => {
  const { commitHash, pathToFile } = req.params;
  const git = spawn('git', ['show', `${commitHash}:${pathToFile}`], { cwd: repoPath });

  let error = false;
  let errorData;

  git.stdout.on('data', data => {
    res.write(data);
  });

  git.stderr.on('data', data => {
    error = true;
    errorData = data;
  });

  git.on('close', _ => {
    if (error) {
      handleError(res, errorData.toString())();
      error = false;
      return;  
    };

    res.status(200).end();
  });
});

repoRouter.get('/commits/:commitHash/diff', async (req, res) => {
  const { commitHash } = req.params;
  const git = spawn('git', ['show', commitHash, `--format=%B`, '--'], { cwd: repoPath });

  let error = false;
  let errorData;

  git.stdout.on('data', data => {
    res.write(data);
  });

  git.stderr.on('data', data => {
    error = true;
    errorData = data;
  });

  git.on('close', _ => {
    if (error) {
      handleError(res, errorData.toString())();
      error = false;
      return;  
    };

    res.status(200).end();
  });
});

module.exports = repoRouter;