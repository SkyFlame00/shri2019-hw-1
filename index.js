const fs = require('fs');
const { join } = require('path');
const express = require('express');
const { spawn, execFile } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const reposPath = process.argv[2];
const MAIN_BRANCH = 'master';

const isRepo = (dirPath) => {
  return fs.existsSync(join(dirPath, '.git'));
};

const getRepos = async (path) => {
  return (await fs.promises.readdir(path, { withFileTypes: true }))
    .filter(entity => entity.isDirectory() && isRepo(join(path, entity.name)))
    .map(entity => entity.name)
  ;
};

const getDefaultRepos = () => getRepos(reposPath);

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

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/repos', async (_, res) => {
  getDefaultRepos()
    .then(repos => res.status(500).json(repos))
    .catch(error => res.status(404).json({ error: true, msg: error.message }))
  ;
});

app.get('/api/repos/:repositoryId/commits/:commitHash', async (req, res) => {
  const { repositoryId, commitHash } = req.params;

  const repos = await getDefaultRepos();

  if (!repos.find(repoId => repoId === repositoryId))
    return res.status(404).json({ error: true, code: 'REPOSITORY_NOT_EXIST' });

  const path = join(reposPath, repositoryId);

  const format = '{ "hash": "%H", "author": "%an", "date": "%ai", "subject": "%s" }';

  execute('git', ['log', commitHash, `--format=${format}`, '--'], path)
    .then(out => {
      const commits = out.trim()
        .split('\n')
        .map(str => JSON.parse(str))
      ;
      
      return res.status(500).json(commits);
    })
  ;
});

app.get('/api/repos/:repositoryId/commits/:commitHash/diff', async (req, res) => {
  const { repositoryId, commitHash } = req.params;

  const repos = await getDefaultRepos();

  if (!repos.find(repoId => repoId === repositoryId))
    return res.status(404).json({ error: true, code: 'REPOSITORY_NOT_EXIST' });
  
  const repoPath = join(reposPath, repositoryId);
  const git = spawn('git', ['show', commitHash, `--format=%B`, '--'], { cwd: repoPath });

  git.stdout.on('data', data => {
    res.write(data);
  });

  git.on('close', code => {
    res.status(code).end();
  });
});

app.get('/api/repos/:repositoryId', async (req, res) => {
  const { repositoryId } = req.params;

  const repos = await getDefaultRepos();

  if (!repos.find(repoId => repoId === repositoryId))
    return res.status(404).json({ error: true, code: 'REPOSITORY_NOT_EXIST' });

  const repoPath = join(reposPath, repositoryId);

  execute('git', ['ls-tree', MAIN_BRANCH, '--name-only'], repoPath)
    .then(out => {
      const entries = out.trim().split('\n');
      res.json(entries);
    })
  ;
});

app.get('/api/repos/:repositoryId/tree', (req, res) => {
  res.json({
    error: true,
    code: 'REPO_CONTENT_BRANCH_NOT_PROVIDED',
    message: 'You did not provide the branch name'
  });
});

app.get('/api/repos/:repositoryId/tree/:commitHash', async (req, res) => {
  const { repositoryId, commitHash } = req.params;

  const repos = await getDefaultRepos();

  if (!repos.find(repoId => repoId === repositoryId))
    return res.status(404).json({ error: true, code: 'REPOSITORY_NOT_EXIST' });

  const repoPath = join(reposPath, repositoryId);

  execute('git', ['ls-tree', commitHash, '--name-only'], repoPath)
    .then(out => {
      const entries = out.trim().split('\n');
      res.json(entries);
    })
  ;
});

app.get('/api/repos/:repositoryId/tree/:commitHash/:path([^ ]+)', async (req, res) => {
  const { repositoryId, commitHash, path: pathRaw } = req.params;

  const repos = await getDefaultRepos();

  if (!repos.find(repoId => repoId === repositoryId))
    return res.status(404).json({ error: true, code: 'REPOSITORY_NOT_EXIST' });

  const repoPath = join(reposPath, repositoryId);
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

app.get('/api/repos/:repositoryId/blob/:commitHash/:pathToFile([^ ]+)', async (req, res) => {
  const { repositoryId, commitHash, pathToFile } = req.params;

  const repos = await getDefaultRepos();

  if (!repos.find(repoId => repoId === repositoryId))
    return res.status(404).json({ error: true, code: 'REPOSITORY_NOT_EXIST' });

  const repoPath = join(reposPath, repositoryId);
  const git = spawn('git', ['show', `${commitHash}:${pathToFile}`], { cwd: repoPath });

  git.stdout.on('data', data => {
    res.write(data);
  });

  git.stderr.on('data', data => {
    res.json({ error: true, message: `Error occured in "${data}"` });
  });

  git.on('close', code => {
    res.status(code).end();
  });
});

app.delete('/api/repos/:repositoryId', async (req, res) => {
  const { repositoryId } = req.params;

  const repos = await getDefaultRepos();

  if (!repos.find(repoId => repoId === repositoryId))
    return res.status(404).json({ error: true, code: 'REPOSITORY_NOT_EXIST' });

  const git = spawn('rm', ['-rf', repositoryId], { cwd: reposPath });

  git.on('close', code => {
    res.json({ message: 'Specified repository has been successfully removed' });
  });
});

app.post('/api/repos', (req, res) => {
  const { url } = req.body;
  const git = spawn('git', ['clone', url], { cwd: reposPath });

  git.on('close', code => {
    res.json({
      message: 'Specified repository has been successfully cloned'
    });
  });
});

app.listen(8080, () => console.log('Listening on port 8080'));