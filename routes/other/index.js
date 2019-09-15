const { Router } = require('express');
const { spawn } = require('child_process');

const otherRouter = Router();

otherRouter.get('/api/repos', async (req, res) => {
  const { getRepos } = req.helpers;
  const { REPOS_PATH } = req.data;

  getRepos(REPOS_PATH)
    .then(repos => res.status(200).json(repos))
    .catch(error => res.status(404).json({ error: true, message: error.message }))
  ;
});

otherRouter.post('/api/repos', (req, res) => {
  const { REPOS_PATH } = req.data;
  const { url } = req.body;
  const git = spawn('git', ['clone', url], { cwd: REPOS_PATH });
  
  git.on('close', _ => {
    res.status(200).json({
      message: 'Specified repository has been successfully cloned'
    });
  });
});

module.exports = otherRouter;