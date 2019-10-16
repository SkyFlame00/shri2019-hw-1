module.exports = agent => {
  agent.post('/build', require('./buildHandler'));
}