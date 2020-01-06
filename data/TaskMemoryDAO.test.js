/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const TaskMemoryDAO = require('./TaskMemoryDAO');

describe('In-Memory TaskDAO', () => {
  describe('constructor()', () => {
    it('should initialize this.maxId to 0', () => {
      const dao = new TaskMemoryDAO();
      chai.assert.strictEqual(dao.maxId, 0);
    });
    it('should initialize this.tasks to an empty array', () => {
      const dao = new TaskMemoryDAO();
      chai.assert.isArray(dao.tasks);
      chai.assert.isEmpty(dao.tasks);
    });
    it('should not be influenced by params', () => {
      const dao = new TaskMemoryDAO(8, 'some string', false);
      chai.assert.strictEqual(dao.maxId, 0);
      chai.assert.isArray(dao.tasks);
      chai.assert.isEmpty(dao.tasks);
    });
  });

  describe('newTask()', () => {
    it('should result in null if Task creation is unsuccessful (no props obj, or no title/course)', () => {
      const dao = new TaskMemoryDAO();

      chai.assert.isNull(dao.newTask());
      chai.assert.isNull(dao.newTask(null));
      chai.assert.isNull(dao.newTask({}));
      chai.assert.isNull(dao.newTask(12));
      chai.assert.isNull(dao.newTask(title = 'something', course = 'eo')); // param is not an object

      chai.assert.isNull(dao.newTask({ title: 'some task' }));
      chai.assert.isNull(dao.newTask({ course: 'course7889' }));
      chai.assert.isNull(dao.newTask({ title: 'some task', otherProp: 'some other property' }));
      chai.assert.isNull(dao.newTask({ course: 'course7889', otherProp: 'some other property' }));
      chai.assert.isNull(dao.newTask({ title: 'some task', otherProp: 'some other property' }));
    });
    it('should return a successfully created task', () => {
      const dao = new TaskMemoryDAO();
      const task = dao.newTask({ title: 'my task', course: 'CS5000' });
      chai.assert.isNotNull(task);
      chai.assert.strictEqual(task.title, 'my task');
      chai.assert.strictEqual(task.course, 'CS5000');
    });
    it('should set default values for non-required properties', () => {
      const dao = new TaskMemoryDAO();
      const task = dao.newTask({ title: 'my task', course: 'CS5000' });
      chai.assert.isNotNull(task);
      chai.assert.isNumber(task.id);
      chai.assert.isNull(task.deadline);
      chai.assert.isFalse(task.completed);
      chai.assert.isNull(task.scheduledDate);
    });
    it('should set all provided properties', () => {
      const dao = new TaskMemoryDAO();
      const props = {
        title: 'my task',
        course: 'CS5000',
        deadline: 'Jan 4, 2020',
        completed: true,
        scheduledDate: 'Jan 1, 2020',
      };
      const task = dao.newTask(props);
      chai.assert.strictEqual(task.title, 'my task');
      chai.assert.strictEqual(task.course, 'CS5000');
      chai.assert.strictEqual(task.deadline, 'Jan 4, 2020');
      chai.assert.isTrue(task.completed);
      chai.assert.strictEqual(task.scheduledDate, 'Jan 1, 2020');
    });
    it('should add the new task to the tasks array', () => {
      const dao = new TaskMemoryDAO();

      dao.newTask({ title: 'my task', course: 'CS5000' });
      chai.assert.lengthOf(dao.tasks, 1);
      chai.assert.strictEqual(dao.tasks[0].title, 'my task');
      chai.assert.strictEqual(dao.tasks[0].course, 'CS5000');

      dao.newTask({ title: 'my task2', course: 'MS3000' });
      chai.assert.lengthOf(dao.tasks, 2);
      chai.assert.strictEqual(dao.tasks[1].title, 'my task2');
      chai.assert.strictEqual(dao.tasks[1].course, 'MS3000');

      dao.newTask({ title: 'my task3', course: 'ENGL3000' });
      chai.assert.lengthOf(dao.tasks, 3);
      chai.assert.strictEqual(dao.tasks[2].title, 'my task3');
      chai.assert.strictEqual(dao.tasks[2].course, 'ENGL3000');
    });
  });
  describe('Querying', () => {
    it('find returns all tasks when no search criteria is used', () => {
      const dao = new TaskMemoryDAO();
      for (let i = 1; i <= 10; i++) {
        dao.newTask({ title: `some task ${i}`, course: `CS500${i}` });
      }
      chai.assert.lengthOf(dao.find(), 10);
      chai.assert.lengthOf(dao.find({}), 10);
      chai.assert.lengthOf(dao.find(null), 10);
    });
    it('returns an array of all tasks that exactly match single-attribute criteria', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task1', course: 'CS5000', completed: true });
      dao.newTask({ title: 'task2', course: 'CS4000' });
      dao.newTask({ title: 'task3', course: 'CS5555' });
      dao.newTask({ title: 'task4', course: 'CS5000' });
      dao.newTask({ title: 'task5', course: 'CS5980' });
      dao.newTask({ title: 'task6', course: 'CS3000' });

      let result = dao.find({ title: 'task4' });
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 1);

      result = dao.find({ course: 'CS5000' });
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 2);

      result = dao.find({ completed: true });
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 1);

      result = dao.find({ completed: false });
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 5);
    });
    it('returns an array of all tasks that exactly match multi-attribute criteria', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task1', course: 'CS5000', completed: true });
      dao.newTask({ title: 'task2', course: 'CS4000' });
      dao.newTask({ title: 'task3', course: 'CS5555' });
      dao.newTask({ title: 'task4', course: 'CS5000' });
      dao.newTask({ title: 'task5', course: 'CS5980' });
      dao.newTask({ title: 'task6', course: 'CS3000' });
      dao.newTask({ title: 'task7', course: 'CS3000', completed: true });
      dao.newTask({ title: 'task8', course: 'CS3000' });
      dao.newTask({ title: 'task9', course: 'CS3000' });

      let result = dao.find({ title: 'task4', course: 'CS5000' });
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 1);

      result = dao.find({ course: 'CS3000', completed: true });
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 1);

      result = dao.find({ course: 'CS3000', completed: false });
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 3);

      result = dao.find({ title: 'task9', completed: false });
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 1);
    });
    it('returns an empty array if no tasks exactly match all the criteria', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task1', course: 'CS5000', completed: true });
      dao.newTask({ title: 'task2', course: 'CS4000' });
      dao.newTask({ title: 'task3', course: 'CS5555' });
      dao.newTask({ title: 'task4', course: 'CS5000' });
      dao.newTask({ title: 'task5', course: 'CS5980' });
      dao.newTask({ title: 'task6', course: 'CS3000' });

      let result = dao.find({ title: 'task8' });
      chai.assert.isArray(result);
      chai.assert.isEmpty(result);

      result = dao.find({ title: 'task1', course: 'CS4040' });
      chai.assert.isArray(result);
      chai.assert.isEmpty(result);

      result = dao.find({ title: 'task1', course: 'CS5000', completed: false });
      chai.assert.isArray(result);
      chai.assert.isEmpty(result);

      result = dao.find({ course: 'MS5000' });
      chai.assert.isArray(result);
      chai.assert.isEmpty(result);

      result = dao.find({ course: 'CS4000', completed: true });
      chai.assert.isArray(result);
      chai.assert.isEmpty(result);
    });
  });
});
