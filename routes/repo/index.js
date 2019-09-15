const { Router } = require('express');
const { spawn } = require('child_process');
const { join } = require('path');

const repoRouter = Router({ mergeParams: true });
let repositoryId,
    repoPath,
    REPOS_PATH,
    MAIN_BRANCH,
    getRepos,
    execute;
const getDefaultRepos = () => getRepos(REPOS_PATH);

repoRouter.use(async (req, res, next) => {
  repositoryId = req.params.repositoryId;
  REPOS_PATH = req.data.REPOS_PATH;
  MAIN_BRANCH = req.data.MAIN_BRANCH;
  execute = req.helpers.execute;
  getRepos = req.helpers.getRepos;

  const repos = await getDefaultRepos();
  if (!repos.find(repoId => repoId === repositoryId))
    return res.status(404).json({ error: true, code: 'REPOSITORY_NOT_EXIST' });
  repoPath = join(REPOS_PATH, repositoryId);
  next();
});

repoRouter.get('/', (req, res) => {
  execute('git', ['ls-tree', MAIN_BRANCH, '--name-only'], repoPath)
    .then(out => {
      const entries = out.trim().split('\n');
      res.json(entries);
    })
  ;
});

repoRouter.delete('/', (req, res) => {
  const git = spawn('rm', ['-rf', repositoryId], { cwd: REPOS_PATH });

  git.on('close', code => {
    res.json({ message: 'Specified repository has been successfully removed' });
  });
});

repoRouter.get('/tree', (req, res) => {
  res.json({
    error: true,
    code: 'REPO_CONTENT_BRANCH_NOT_PROVIDED',
    message: 'You did not provide the branch name'
  });
});

repoRouter.get('/tree/:commitHash', async (req, res) => {
  const { commitHash } = req.params;

  execute('git', ['ls-tree', commitHash, '--name-only'], repoPath)
    .then(out => {
      const entries = out.trim().split('\n');
      res.json(entries);
    })
  ;
});

repoRouter.get('/tree/:commitHash/:path([^ ]+)', async (req, res) => {
  const { commitHash, path: pathRaw } = req.params;
  const path = pathRaw[pathRaw.length - 1] === '/' ? pathRaw : pathRaw + '/';

  execute('git', ['ls-tree', '--name-only', commitHash, path], repoPath)
    .then(out => {
      const entries = out.trim()
        .split('\n')
        .map(path => {
          const entities = path.split('/');
          return entities[entities.length - 1];
        })
      ;

      return res.json(entries);
    })
  ;
});

repoRouter.get('/blob/:commitHash/:pathToFile([^ ]+)', (req, res) => {
  const { commitHash, pathToFile } = req.params;
  const git = spawn('git', ['show', `${commitHash}:${pathToFile}`], { cwd: repoPath });

  git.stdout.on('data', data => {
    res.write(data);
  });

  git.stderr.on('data', data => {
    res.json({ error: true, message: `Error occured in "${data}"` });
  });

  git.on('close', _ => {
    res.end();
  });
});

module.exports = repoRouter;