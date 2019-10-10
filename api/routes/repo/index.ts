import { Router } from 'express';
import { spawn } from 'child_process';
import { join } from 'path';
import rimraf from 'rimraf';

const repoRouter = Router({ mergeParams: true });
let repositoryId: string;
let repoPath: string;
let REPOS_PATH: string;
let MAIN_BRANCH: string;
let getRepos: ArcanumAPI.GetRepos;
let execute: ArcanumAPI.Execute;
let handleError: ArcanumAPI.HandleError;

const getDefaultRepos = (): Promise<string[]> => getRepos(REPOS_PATH);

interface Entry {
  isDir: boolean;
  fileName: string;
}

const processFilesString = (out: string): Entry[] => {
  return out.split('\n')
    .filter(str => str && str.length > 0)
    .map(str => str.split('\t'))
    .map(([str, path]) => {
      const pathArr = path.split('/');
      return [str.split(' ')[1], pathArr[pathArr.length - 1]];
    })
    .map(([type, fileName]) => ({
      isDir: type === 'tree',
      fileName
    }));
}

repoRouter.use(async (req, res, next) => {
  repositoryId = req.params.repositoryId;
  REPOS_PATH = req.data.REPOS_PATH;
  MAIN_BRANCH = req.data.MAIN_BRANCH;
  execute = req.helpers.execute;
  getRepos = req.helpers.getRepos;
  handleError = req.helpers.handleError;

  let repos: string[];

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

repoRouter.get('/', (req, res) => {
  execute('git', ['ls-tree', MAIN_BRANCH, '--full-name'], repoPath)
    .then(out => {
      const entries = processFilesString(out);
      return res.status(200).json(entries);
    })
    .catch(handleError(res));
});

repoRouter.delete('/', (req, res) => {
  rimraf(`${REPOS_PATH}/${repositoryId}`, err => {
    if (err) {
      return handleError(res)(err);
    }

    return res.status(200).end();
  });
});

repoRouter.get('/tree', (req, res) => {
  return handleError(res, 'You did not provide the branch name')();
});

repoRouter.get('/tree/:commitHash', (req, res) => {
  const { commitHash } = req.params;

  execute('git', ['ls-tree', commitHash, '--full-name'], repoPath)
    .then(out => {
      const entries = processFilesString(out);
      return res.status(200).json(entries);
    })
    .catch(handleError(res));
});

repoRouter.get('/tree/:commitHash/:path([^ ]+)', (req, res) => {
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
  let errorData: string | undefined;

  git.stdout.on('data', (data: string) => {
    res.write(data);
  });

  git.stderr.on('data', (data: string) => {
    error = true;
    errorData = data;
  });

  git.on('close', () => {
    if (error && typeof errorData === 'string') {
      handleError(res, errorData.toString())();
      error = false;
      return;  
    };

    res.status(200).end();
  });
});

repoRouter.get('/commits/:commitHash/diff', (req, res) => {
  const { commitHash } = req.params;
  const git = spawn('git', ['show', commitHash, `--format=%B`, '--'], { cwd: repoPath });

  let error = false;
  let errorData: string | undefined;

  git.stdout.on('data', (data: string) => {
    res.write(data);
  });

  git.stderr.on('data', (data: string) => {
    error = true;
    errorData = data;
  });

  git.on('close', () => {
    if (error && typeof errorData === 'string') {
      handleError(res, errorData.toString())();
      error = false;
      return;  
    };

    res.status(200).end();
  });
});

export default repoRouter;