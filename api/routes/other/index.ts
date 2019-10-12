import { Router } from 'express';
import { spawn } from 'child_process';

const otherRouter = Router();

otherRouter.get('/api/repos', (req, res) => {
  const { getRepos, handleError } = req.helpers;
  const REPOS_PATH = req.data && req.data.REPOS_PATH;

  getRepos(REPOS_PATH)
    .then((repos: string[]) => res.status(200).json(repos))
    .catch(handleError(res));
});

otherRouter.post('/api/repos', (req, res) => {
  const { handleError } = req.helpers;
  const { REPOS_PATH } = req.data;
  const { url } = req.body;
  const git = spawn('git', ['clone', url], { cwd: REPOS_PATH });

  let error = false;
  let errorData: string | undefined;

  git.stderr.on('data', dataRaw => {
    const reArr = [/Cloning into/, /done/];
    const data = dataRaw.toString().trim();

    if (!reArr.some(re => re.test(data))) {
      error = true;
      errorData = data;
    }
  });

  git.on('close', () => {
    if (error) {
      handleError(res, errorData)();
      error = false;
      return;
    }

    res.status(200).end();
  });
});

export default otherRouter;
