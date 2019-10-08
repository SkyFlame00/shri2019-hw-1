const { Router } = require('express');
const { spawn } = require('child_process');

const otherRouter = Router();

otherRouter.get('/api/repos', async (req, res) => {
  const { getRepos, handleError } = req.helpers;
  const { REPOS_PATH } = req.data;

  getRepos(REPOS_PATH)
    .then(repos => res.status(200).json(repos))
    .catch(handleError(res))
  ;
});

otherRouter.post('/api/repos', (req, res) => {
  const { handleError } = req.helpers;
  const { REPOS_PATH } = req.data;
  const { url } = req.body;
  const git = spawn('git', ['clone', url], { cwd: REPOS_PATH });

  let error = false;
  let errorData;

  git.stderr.on('data', dataRaw => {
    const reArr = [
      /Cloning into/,
      /done/
    ];
    const data = dataRaw.toString().trim();

    if (!reArr.some(re => re.test(data))) {
      error = true;
      errorData = data;
    }
  });

  git.on('close', _ => {
    if (error) {
      handleError(res, errorData)();
      error = false;
      return;  
    };

    res.status(200).end();
  });
});

module.exports = otherRouter;