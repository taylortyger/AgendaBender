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
    describe('find()', () => {
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
        dao.newTask({ title: 'task6', course: 'CS3000', completed: true });
        dao.newTask({ title: 'task7', course: 'CS3000' });
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
    describe('findById()', () => {
      it('returns a task with the given id if it exists in the tasks array', () => {
        const dao = new TaskMemoryDAO();

        let newTask = dao.newTask({ title: 'some task', course: 'CS1111' });
        let resultTask = dao.findById(newTask.id);
        chai.assert.isNotNull(resultTask);
        chai.assert.deepEqual(newTask, resultTask);

        newTask = dao.newTask({ title: 'some task2', course: 'CS2222' });
        resultTask = dao.findById(newTask.id);
        chai.assert.isNotNull(resultTask);
        chai.assert.deepEqual(newTask, resultTask);

        newTask = dao.newTask({ title: 'some task3', course: 'CS3333' });
        resultTask = dao.findById(newTask.id);
        chai.assert.isNotNull(resultTask);
        chai.assert.deepEqual(newTask, resultTask);
      });
      it('returns null if a task with the given id does not exist in the tasks array', () => {
        const dao = new TaskMemoryDAO();

        // no tasks added yet
        chai.assert.isNull(dao.findById(50));
        chai.assert.isNull(dao.findById(0));
        chai.assert.isNull(dao.findById(1));

        // with tasks added to tasks array
        dao.newTask({ title: 't1', course: 'C1' });
        dao.newTask({ title: 't2', course: 'C2' });
        dao.newTask({ title: 't3', course: 'C3' });
        dao.newTask({ title: 't4', course: 'C4' });

        chai.assert.isNull(dao.findById(dao.maxId + 5));
      });
    });
  });
  describe('updateTask()', () => {
    it('should update the provided task properties when a task with the given id exists', () => {
      const dao = new TaskMemoryDAO();

      let newTask = dao.newTask({ title: 'some task', course: 'CS1111' });
      let props = {
        id: newTask.id,
        title: 'new title',
        course: 'new course',
        completed: true,
        deadline: 'December 20, 2020',
      };
      let updatedTask = dao.updateTask(props);
      chai.assert.isNotNull(updatedTask);
      chai.assert.strictEqual(updatedTask.id, props.id);
      chai.assert.strictEqual(updatedTask.title, 'new title');
      chai.assert.strictEqual(updatedTask.course, 'new course');
      chai.assert.isTrue(updatedTask.completed);
      chai.assert.strictEqual(updatedTask.deadline, 'December 20, 2020');

      newTask = dao.newTask({ title: 'some task 2', course: 'CS2222' });
      props = { id: newTask.id, title: 'new title 2' };
      updatedTask = dao.updateTask(props);
      chai.assert.isNotNull(updatedTask);
      chai.assert.strictEqual(updatedTask.id, props.id);
      chai.assert.strictEqual(updatedTask.title, 'new title 2');

      newTask = dao.newTask({ title: 'some task 3', course: 'CS3333' });
      props = { id: newTask.id, course: 'new course id' };
      updatedTask = dao.updateTask(props);
      chai.assert.isNotNull(updatedTask);
      chai.assert.strictEqual(updatedTask.id, props.id);
      chai.assert.strictEqual(updatedTask.course, 'new course id');
    });
    it('should not change properties that are not provided in props object', () => {
      const dao = new TaskMemoryDAO();

      let newTask = dao.newTask({ title: 'some task', course: 'CS1111' });
      let expected = {
        id: newTask.id,
        title: 'new title',
        course: newTask.course,
        completed: newTask.completed,
        deadline: newTask.deadline,
        scheduledDate: newTask.scheduledDate,
      };
      let updatedTask = dao.updateTask({ id: newTask.id, title: 'new title' });
      chai.assert.isNotNull(updatedTask);
      chai.assert.strictEqual(updatedTask.id, expected.id);
      chai.assert.strictEqual(updatedTask.title, expected.title);
      chai.assert.strictEqual(updatedTask.course, expected.course);
      chai.assert.strictEqual(updatedTask.completed, expected.completed);
      chai.assert.strictEqual(updatedTask.deadline, expected.deadline);

      newTask = dao.newTask({ title: 'some task 2', course: 'CS2222' });
      expected = {
        id: newTask.id,
        title: newTask.title,
        course: 'CS5000',
        completed: newTask.completed,
        deadline: newTask.deadline,
        scheduledDate: newTask.scheduledDate,
      };
      updatedTask = dao.updateTask({ id: newTask.id, course: 'CS5000' });
      chai.assert.isNotNull(updatedTask);
      chai.assert.strictEqual(updatedTask.id, expected.id);
      chai.assert.strictEqual(updatedTask.title, expected.title);
      chai.assert.strictEqual(updatedTask.course, expected.course);
      chai.assert.strictEqual(updatedTask.completed, expected.completed);
      chai.assert.strictEqual(updatedTask.deadline, expected.deadline);
    });
    it('should return null if props object parameter is not valid (non existent, empty, or no id)', () => {
      const dao = new TaskMemoryDAO();
      const propsNoId = { title: 'new title', course: 'new course', completed: true };
      const nonExistentId = 5555;
      chai.assert.isNull(dao.updateTask());
      chai.assert.isNull(dao.updateTask({}));
      chai.assert.isNull(dao.updateTask(propsNoId));
      chai.assert.isNull(dao.updateTask({ id: nonExistentId, course: 'new course' }));

      dao.newTask({ title: 'test task1', course: 'TEST1234' });
      dao.newTask({ title: 'test task2', course: 'TEST1234' });
      dao.newTask({ title: 'test task3', course: 'TEST1234' });
      dao.newTask({ title: 'test task4', course: 'TEST1234' });
      dao.newTask({ title: 'test task5', course: 'TEST1234' });

      chai.assert.isNull(dao.updateTask());
      chai.assert.isNull(dao.updateTask({}));
      chai.assert.isNull(dao.updateTask(propsNoId));
      chai.assert.isNull(dao.updateTask({ id: nonExistentId, course: 'new course' }));
    });
  });
  describe('deleteById()', () => {
    it('should delete the task with the given id from dao.tasks', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      const deleteId = dao.newTask({ title: 'task to delete', course: 'TEST1234' }).id;
      chai.assert.lengthOf(dao.tasks, 4);

      dao.deleteById(deleteId);
      chai.assert.lengthOf(dao.tasks, 3);

      const stillExists = dao.tasks.reduce((res, task) => res || (task.id === deleteId), false);
      chai.assert.isFalse(stillExists, 'A task with the deleteId still exists in the tasks array');
    });
    it('should not delete any tasks if a task with the given id does not exist', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      chai.assert.lengthOf(dao.tasks, 3);
      const nonExistentId = 5555;

      dao.deleteById(nonExistentId);
      chai.assert.lengthOf(dao.tasks, 3);
    });
    it('should return the deleted task', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      dao.newTask({ title: 'task 1', course: 'TEST1234' });
      const deleteId = dao.newTask({ title: 'task to delete', course: 'TEST1234' }).id;

      const deletedTask = dao.deleteById(deleteId);
      chai.assert.isNotNull(deletedTask);
      chai.assert.strictEqual(deletedTask.id, deleteId);
      chai.assert.strictEqual(deletedTask.title, 'task to delete');
      chai.assert.strictEqual(deletedTask.course, 'TEST1234');
    });
    it('should return null if no task with the given id is found', () => {
      const dao = new TaskMemoryDAO();
      chai.assert.isNull(dao.deleteById());
      chai.assert.isNull(dao.deleteById(5555));
    });
  });
});
