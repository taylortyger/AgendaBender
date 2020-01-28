/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const UnitOfWork = require('./UnitOfWork');
const Task = require('./Task');
const TaskMemoryDAO = require('./TaskMemoryDAO');
const TaskRepository = require('./TaskRepository');
const CourseMemoryDAO = require('./CourseMemoryDAO');
const CourseRepository = require('./CourseRepository');

describe('UnitOfWork', () => {
  describe('constructor()', () => {
    it('Should accept and set a TaskRepository and a CourseRepository', () => {
      const taskRepo = new TaskRepository(new TaskMemoryDAO());
      const courseRepo = new CourseRepository(new CourseMemoryDAO());
      const uow = new UnitOfWork(taskRepo, courseRepo);
      chai.expect(uow.taskRepo).to.be.an.instanceOf(TaskRepository);
      chai.expect(uow.courseRepo).to.be.an.instanceOf(CourseRepository);
    });
  });

  describe('createTask()', () => {
    let uow;
    beforeEach(() => {
      const taskRepo = new TaskRepository(new TaskMemoryDAO());
      const courseRepo = new CourseRepository(new CourseMemoryDAO());
      uow = new UnitOfWork(taskRepo, courseRepo);
    });

    it('should create and return a task with a valid title and course id', () => {
      const courseId = uow.courseRepo.newCourse('My Course').id;
      const result = uow.createTask('My Task', courseId);
      chai.expect(result).to.be.an.instanceOf(Task);
      chai.expect(result.title).to.equal('My Task');
      chai.expect(result.courseId).to.equal(courseId);
    });

    it('should not allow a task to be created if the given courseId does not exist', () => {
      chai.expect(() => uow.createTask('My Task', 5)).to.throw('A course with the given courseId does not exist');
      uow.courseRepo.newCourse('My Course 1');
      uow.courseRepo.newCourse('My Course 2');
      uow.courseRepo.newCourse('My Course 3');
      chai.expect(() => uow.createTask('My Task', -1)).to.throw('A course with the given courseId does not exist');
    });

    it('should not allow a task to be created with invalid input', () => {
      chai.expect(() => uow.createTask()).to.throw('A task must have a valid title and courseId');
      chai.expect(() => uow.createTask('My Task')).to.throw('A task must have a valid title and courseId');
      chai.expect(() => uow.createTask(1234)).to.throw('A task must have a valid title and courseId');
      chai.expect(() => uow.createTask(1234, {})).to.throw('A task must have a valid title and courseId');
    });
  });
});