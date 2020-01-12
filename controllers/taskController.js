// eslint-disable-next-line prefer-destructuring
const argv = require('yargs').argv;
const TaskRepository = require('../data/TaskRepository');
const TaskMemoryDAO = require('../data/TaskMemoryDAO');
const seed = require('../dev/seed');

const taskRepo = new TaskRepository(new TaskMemoryDAO());

// will this ever be called twice?
if (process.env.NODE_ENV === 'development' && argv.seed) {
  console.log('seeding database...');
  seed(taskRepo, argv.seed);
}

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
