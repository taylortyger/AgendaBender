const UnitOfWork = require('../data/UnitOfWork');

const uow = new UnitOfWork();

const getAll = (req, res) => {
  res.send(uow.courseRepo.getAll());
};

const getById = (req, res) => {
  const course = uow.courseRepo.getById(parseInt(req.params.id, 10));
  if (course) {
    res.send(course);
  } else {
    res.status(404).send('The course with the given id was not found.');
  }
};

const create = (req, res) => {
  res.json(uow.courseRepo.newCourse(req.body.title));
};

const updateById = (req, res) => {
  const props = {
    id: parseInt(req.params.id, 10),
    title: req.body.title,
  };
  const course = uow.courseRepo.update(props);
  if (course) {
    res.send(course);
  } else {
    res.status(404).send('The course with the given id was not found.');
  }
};

const deleteById = (req, res) => {
  const deletedCourse = uow.courseRepo.deleteById(parseInt(req.params.id, 10));
  if (deletedCourse) {
    res.send(deletedCourse);
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
