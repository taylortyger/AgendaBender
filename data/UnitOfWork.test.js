const chai = require('chai');

const expect = chai.expect;
const UnitOfWork = require('./UnitOfWork');
const InMemoryDataStore = require('./InMemoryDataStore');
const Task = require('./Task');
const TaskRepository = require('./TaskRepository');
const CourseRepository = require('./CourseRepository');

describe('UnitOfWork', () => {
  describe('constructor()', () => {
    it('Should have acces to a TaskRepository and a CourseRepository', () => {
      const unitOfWork = new UnitOfWork();
      expect(unitOfWork.taskRepo).to.be.an.instanceOf(TaskRepository);
      expect(unitOfWork.courseRepo).to.be.an.instanceOf(CourseRepository);
    });
  });

  describe('createTask()', () => {
    let unitOfWork;
    beforeEach(() => {
      unitOfWork = new UnitOfWork();
      InMemoryDataStore.clear();
    });

    afterEach(() => {
      InMemoryDataStore.clear();
    });

    it('should create and return a task with a valid title and course id', () => {
      const courseId = unitOfWork.courseRepo.newCourse('My Course').id;
      const result = unitOfWork.createTask('My Task', courseId);
      expect(result).to.be.an.instanceOf(Task);
      expect(result.title).to.equal('My Task');
      expect(result.courseId).to.equal(courseId);
    });

    it('should not allow a task to be created if the given courseId does not exist', () => {
      expect(() => unitOfWork.createTask('My Task', 5)).to.throw('A course with id 5 does not exist');
      unitOfWork.courseRepo.newCourse('My Course 1');
      unitOfWork.courseRepo.newCourse('My Course 2');
      unitOfWork.courseRepo.newCourse('My Course 3');
      expect(() => unitOfWork.createTask('My Task', -1)).to.throw('A course with id -1 does not exist');
    });

    it('should not allow a task to be created with invalid input', () => {
      expect(() => unitOfWork.createTask()).to.throw('A task must have a valid title and courseId');
      expect(() => unitOfWork.createTask('My Task')).to.throw('A task must have a valid title and courseId');
      expect(() => unitOfWork.createTask(1234)).to.throw('A task must have a valid title and courseId');
      expect(() => unitOfWork.createTask(1234, {})).to.throw('A task must have a valid title and courseId');
    });
  });
});
