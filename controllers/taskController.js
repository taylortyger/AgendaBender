const TaskRepository = require('../data/TaskRepository');
const TaskMemoryDAO = require('../data/TaskMemoryDAO');

const taskRepo = new TaskRepository(new TaskMemoryDAO());

const getAll = (req, res) => {
  res.send(taskRepo.getAll());
};

const getByID = (req, res) => {
  const task = taskRepo.getByID(parseInt(req.params.id, 10));
  if (task) {
    res.send(task);
  } else {
    res.status(404).send('The task with the given id was not found.');
  }
};

const create = (req, res) => {
  res.json(taskRepo.newTask({
    title: req.body.title,
    course: req.body.course,
    deadline: req.body.deadline,
  }));
};

const updateByID = (req, res) => {
  const props = {
    id: parseInt(req.params.id, 10),
    title: req.body.title,
    course: req.body.course,
    deadline: req.body.deadline,
    completed: req.body.completed,
    scheduledDate: req.body.scheduledDate,
  };
  const task = taskRepo.update(props);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send('The task with the given id was not found.');
  }
};

const deleteByID = (req, res) => {
  const deletedTask = taskRepo.deleteByID(parseInt(req.params.id, 10));
  if (deletedTask) {
    res.send(deletedTask);
  } else {
    res.status(404).send('The task with the given id was not found.');
  }
};

module.exports = {
  getAll,
  getByID,
  create,
  updateByID,
  deleteByID,
};
