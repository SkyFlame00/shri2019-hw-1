const { Router } = require('express');

const otherRouter = Router();

app.get('/api/repos', async (_, res) => {
  const { getDefaultRepos } = req.helpers;

  getDefaultRepos()
    .then(repos => res.status(500).json(repos))
    .catch(error => res.status(404).json({ error: true, msg: error.message }))
  ;
});

app.post('/api/repos', (req, res) => {
  const { reposPath } = req.data;
  const { url } = req.body;
  const git = spawn('git', ['clone', url], { cwd: reposPath });
  
  git.on('close', _ => {
    res.status(500).json({
      message: 'Specified repository has been successfully cloned'
    });
  });
});

module.exports = otherRouter;