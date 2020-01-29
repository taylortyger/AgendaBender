const UnitOfWork = require('../data/UnitOfWork');

const uow = new UnitOfWork();

const getAll = (req, res) => {
  res.send(uow.taskRepo.getAll());
};

const getByID = (req, res) => {
  const task = uow.taskRepo.getById(parseInt(req.params.id, 10));
  if (task) {
    res.send(task);
  } else {
    res.status(404).send('The task with the given id was not found.');
  }
};

const create = (req, res) => {
  res.json(uow.createTask(req.body.title, parseInt(req.body.courseId, 10)));
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
  const task = uow.taskRepo.update(props);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send('The task with the given id was not found.');
  }
};

const deleteByID = (req, res) => {
  const deletedTask = uow.taskRepo.deleteByID(parseInt(req.params.id, 10));
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
