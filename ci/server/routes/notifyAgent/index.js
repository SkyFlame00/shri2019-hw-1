module.exports = (req, res) => {
  const { agentsController } = req.controllers;
  const agent = req.body;
  const queue = agentsController.tasksQueue;
  let isBusy;

  res.end();

  if (queue.length > 0) {
    const task = queue.splice(0, 1)[0];
    agentsController.runTask(task, agent);
    isBusy = true;
  } else {
    isBusy = false;
  }

  agentsController.addAgent({
    ...agent,
    isBusy
  });
}