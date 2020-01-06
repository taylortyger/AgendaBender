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
      chai.assert.isNull(dao.newTask({}));
      chai.assert.isNull(dao.newTask(null));
      chai.assert.isNull(dao.newTask(12));
      chai.assert.isNull(dao.newTask(title = 'something', course = 'eo'));

      chai.assert.isNull(dao.newTask({
        title: 'some task',
      }));
      chai.assert.isNull(dao.newTask({
        course: 'course7889',
      }));
      chai.assert.isNull(dao.newTask({
        title: 'some task',
        otherProp: 'some other property',
      }));
      chai.assert.isNull(dao.newTask({
        course: 'course7889',
        otherProp: 'some other property',
      }));
      chai.assert.isNull(dao.newTask({
        title: 'some task',
        otherProp: 'some other property',
      }));
    });
    it('should return a successfully created task', () => {
      const dao = new TaskMemoryDAO();
      const props = {
        title: 'my task',
        course: 'CS5000',
      };
      const task = dao.newTask(props);
      chai.assert.isNotNull(task);
      chai.assert.strictEqual(task.title, 'my task');
      chai.assert.strictEqual(task.course, 'CS5000');
    });
    it('should set default values for non-required properties', () => {
      const dao = new TaskMemoryDAO();
      const props = {
        title: 'my task',
        course: 'CS5000',
      };
      const task = dao.newTask(props);
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
    it('should add task to the tasks array', () => {
      const dao = new TaskMemoryDAO();

      dao.newTask({
        title: 'my task',
        course: 'CS5000',
      });
      chai.assert.lengthOf(dao.tasks, 1);
      chai.assert.strictEqual(dao.tasks[0].title, 'my task');
      chai.assert.strictEqual(dao.tasks[0].course, 'CS5000');

      dao.newTask({
        title: 'my task2',
        course: 'MS3000',
      });
      chai.assert.lengthOf(dao.tasks, 2);
      chai.assert.strictEqual(dao.tasks[1].title, 'my task2');
      chai.assert.strictEqual(dao.tasks[1].course, 'MS3000');

      dao.newTask({
        title: 'my task3',
        course: 'ENGL3000',
      });
      chai.assert.lengthOf(dao.tasks, 3);
      chai.assert.strictEqual(dao.tasks[2].title, 'my task3');
      chai.assert.strictEqual(dao.tasks[2].course, 'ENGL3000');
    });
  });
});
