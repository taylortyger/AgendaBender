const UnitOfWork = require('../data/UnitOfWork');

const unitOfWork = new UnitOfWork();

const getAll = (req, res) => {
  res.send(unitOfWork.taskRepo.getAll());
};

const getById = (req, res) => {
  const task = unitOfWork.taskRepo.getById(parseInt(req.params.id, 10));
  if (task) {
    res.send(task);
  } else {
    res.status(404).send('The task with the given id was not found.');
  }
};

const create = (req, res) => {
  res.json(unitOfWork.createTask(req.body.title, parseInt(req.body.courseId, 10)));
};

const updateById = (req, res) => {
  const props = {
    id: parseInt(req.params.id, 10),
    title: req.body.title,
    course: req.body.course,
    deadline: req.body.deadline,
    completed: req.body.completed,
    scheduledDate: req.body.scheduledDate,
  };
  const task = unitOfWork.taskRepo.update(props);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send('The task with the given id was not found.');
  }
};

const deleteById = (req, res) => {
  const deletedTask = unitOfWork.taskRepo.deleteById(parseInt(req.params.id, 10));
  if (deletedTask) {
    res.send(deletedTask);
  } else {
    res.status(404).send('The task with the given id was not found.');
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
