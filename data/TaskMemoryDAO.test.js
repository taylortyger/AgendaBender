/* eslint-disable no-unused-expressions */
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
    it('should result in falsy if Task creation is unsuccessful (no props obj, or no title/course)', () => {
      const dao = new TaskMemoryDAO();
      chai.assert.isNotOk(dao.newTask());
      chai.assert.isNotOk(dao.newTask(null));
      chai.assert.isNotOk(dao.newTask(undefined));
      chai.assert.isNotOk(dao.newTask({}));
      chai.assert.isNotOk(dao.newTask(12));
      chai.assert.isNotOk(dao.newTask(title = 'something', courseId = 1)); // param is not an object

      chai.assert.isNotOk(dao.newTask({ title: 'some task' }));
      chai.assert.isNotOk(dao.newTask({ courseId: 7 }));
      chai.assert.isNotOk(dao.newTask({ title: 'some task', otherProp: 'some other property' }));
      chai.assert.isNotOk(dao.newTask({ courseId: 1, otherProp: 'some other property' }));
      chai.assert.isNotOk(dao.newTask({ title: 'some task', otherProp: 'some other property' }));
    });
    it('should return a successfully created task', () => {
      const dao = new TaskMemoryDAO();
      const task = dao.newTask({ title: 'my task', courseId: 5 });
      chai.assert.isOk(task);
      chai.assert.strictEqual(task.title, 'my task');
      chai.assert.strictEqual(task.courseId, 5);
    });
    it('should set default values for non-required properties', () => {
      const dao = new TaskMemoryDAO();
      const task = dao.newTask({ title: 'my task', courseId: 5 });
      chai.assert.isOk(task);
      chai.assert.isNumber(task.id);
      chai.assert.isNull(task.deadline);
      chai.assert.isFalse(task.completed);
      chai.assert.isNull(task.scheduledDate);
    });
    it('should set all provided properties', () => {
      const dao = new TaskMemoryDAO();
      const props = {
        title: 'my task',
        courseId: 5,
        deadline: 'Jan 4, 2020',
        completed: true,
        scheduledDate: 'Jan 1, 2020',
      };
      const task = dao.newTask(props);
      chai.assert.strictEqual(task.title, 'my task');
      chai.assert.strictEqual(task.courseId, 5);
      chai.assert.strictEqual(task.deadline, 'Jan 4, 2020');
      chai.assert.isTrue(task.completed);
      chai.assert.strictEqual(task.scheduledDate, 'Jan 1, 2020');
    });
    it('should add the new task to the tasks array', () => {
      const dao = new TaskMemoryDAO();

      dao.newTask({ title: 'my task', courseId: 10 });
      chai.assert.lengthOf(dao.tasks, 1);
      chai.assert.strictEqual(dao.tasks[0].title, 'my task');
      chai.assert.strictEqual(dao.tasks[0].courseId, 10);

      dao.newTask({ title: 'my task2', courseId: 3 });
      chai.assert.lengthOf(dao.tasks, 2);
      chai.assert.strictEqual(dao.tasks[1].title, 'my task2');
      chai.assert.strictEqual(dao.tasks[1].courseId, 3);

      dao.newTask({ title: 'my task3', courseId: 6 });
      chai.assert.lengthOf(dao.tasks, 3);
      chai.assert.strictEqual(dao.tasks[2].title, 'my task3');
      chai.assert.strictEqual(dao.tasks[2].courseId, 6);
    });
  });
  describe('Querying', () => {
    describe('find()', () => {
      it('find returns all tasks when no search criteria is used', () => {
        const dao = new TaskMemoryDAO();
        for (let i = 1; i <= 10; i++) {
          dao.newTask({ title: `some task ${i}`, courseId: i });
        }
        chai.assert.lengthOf(dao.find(), 10);
        chai.assert.lengthOf(dao.find({}), 10);
        chai.assert.lengthOf(dao.find(null), 10);
      });
      it('returns an array of all tasks that exactly match single-attribute criteria', () => {
        const dao = new TaskMemoryDAO();
        dao.newTask({ title: 'task1', courseId: 5, completed: true });
        dao.newTask({ title: 'task2', courseId: 4 });
        dao.newTask({ title: 'task3', courseId: 55 });
        dao.newTask({ title: 'task4', courseId: 5 });
        dao.newTask({ title: 'task5', courseId: 59 });
        dao.newTask({ title: 'task6', courseId: 3 });

        let result = dao.find({ title: 'task4' });
        chai.assert.isArray(result);
        chai.assert.lengthOf(result, 1);

        result = dao.find({ courseId: 5 });
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
        dao.newTask({ title: 'task1', courseId: 5, completed: true });
        dao.newTask({ title: 'task2', courseId: 4 });
        dao.newTask({ title: 'task3', courseId: 55 });
        dao.newTask({ title: 'task4', courseId: 5 });
        dao.newTask({ title: 'task5', courseId: 59 });
        dao.newTask({ title: 'task6', courseId: 3, completed: true });
        dao.newTask({ title: 'task7', courseId: 3 });
        dao.newTask({ title: 'task8', courseId: 3 });
        dao.newTask({ title: 'task9', courseId: 3 });

        let result = dao.find({ title: 'task4', courseId: 5 });
        chai.assert.isArray(result);
        chai.assert.lengthOf(result, 1);

        result = dao.find({ courseId: 3, completed: true });
        chai.assert.isArray(result);
        chai.assert.lengthOf(result, 1);

        result = dao.find({ courseId: 3, completed: false });
        chai.assert.isArray(result);
        chai.assert.lengthOf(result, 3);

        result = dao.find({ title: 'task9', completed: false });
        chai.assert.isArray(result);
        chai.assert.lengthOf(result, 1);
      });
      it('returns an empty array if no tasks exactly match all the criteria', () => {
        const dao = new TaskMemoryDAO();
        dao.newTask({ title: 'task1', courseId: 5, completed: true });
        dao.newTask({ title: 'task2', courseId: 4 });
        dao.newTask({ title: 'task3', courseId: 55 });
        dao.newTask({ title: 'task4', courseId: 5 });
        dao.newTask({ title: 'task5', courseId: 59 });
        dao.newTask({ title: 'task6', courseId: 3 });

        let result = dao.find({ title: 'task8' });
        chai.assert.isArray(result);
        chai.assert.isEmpty(result);

        result = dao.find({ title: 'task1', courseId: 40 });
        chai.assert.isArray(result);
        chai.assert.isEmpty(result);

        result = dao.find({ title: 'task1', courseId: 5, completed: false });
        chai.assert.isArray(result);
        chai.assert.isEmpty(result);

        result = dao.find({ courseId: 500 });
        chai.assert.isArray(result);
        chai.assert.isEmpty(result);

        result = dao.find({ courseId: 4, completed: true });
        chai.assert.isArray(result);
        chai.assert.isEmpty(result);
      });
    });
    describe('findById()', () => {
      it('returns a task with the given id if it exists in the tasks array', () => {
        const dao = new TaskMemoryDAO();

        let newTask = dao.newTask({ title: 'some task', courseId: 1 });
        let resultTask = dao.findById(newTask.id);
        chai.expect(resultTask).to.be.ok;
        chai.expect(resultTask).to.be.deep.equal(resultTask);

        newTask = dao.newTask({ title: 'some task2', courseId: 2 });
        resultTask = dao.findById(newTask.id);
        chai.expect(resultTask).to.be.ok;
        chai.expect(resultTask).to.be.deep.equal(resultTask);

        newTask = dao.newTask({ title: 'some task3', courseId: 3 });
        resultTask = dao.findById(newTask.id);
        chai.expect(resultTask).to.be.ok;
        chai.expect(resultTask).to.be.deep.equal(resultTask);
      });
      it('returns falsy value if a task with the given id does not exist in the tasks array', () => {
        const dao = new TaskMemoryDAO();

        // no tasks added yet
        chai.expect(dao.findById(50)).to.not.be.ok;
        chai.expect(dao.findById(0)).to.not.be.ok;
        chai.expect(dao.findById(1)).to.not.be.ok;

        // with tasks added to tasks array
        dao.newTask({ title: 't1', courseId: 1 });
        dao.newTask({ title: 't2', courseId: 2 });
        dao.newTask({ title: 't3', courseId: 3 });
        dao.newTask({ title: 't4', courseId: 4 });

        chai.expect(dao.findById(dao.maxId + 5)).to.not.be.ok;
      });
    });
  });
  describe('updateTask()', () => {
    it('should update the provided task properties when a task with the given id exists', () => {
      const dao = new TaskMemoryDAO();

      let newTask = dao.newTask({ title: 'some task', courseId: 1 });
      let props = {
        id: newTask.id,
        title: 'new title',
        courseId: 2,
        completed: true,
        deadline: 'December 20, 2020',
      };
      let updatedTask = dao.updateTask(props);
      chai.assert.isOk(updatedTask);
      chai.assert.strictEqual(updatedTask.id, props.id);
      chai.assert.strictEqual(updatedTask.title, 'new title');
      chai.assert.strictEqual(updatedTask.courseId, 2);
      chai.assert.isTrue(updatedTask.completed);
      chai.assert.strictEqual(updatedTask.deadline, 'December 20, 2020');

      newTask = dao.newTask({ title: 'some task 2', courseId: 2 });
      props = { id: newTask.id, title: 'new title 2' };
      updatedTask = dao.updateTask(props);
      chai.assert.isOk(updatedTask);
      chai.assert.strictEqual(updatedTask.id, props.id);
      chai.assert.strictEqual(updatedTask.title, 'new title 2');

      newTask = dao.newTask({ title: 'some task 3', courseId: 3 });
      props = { id: newTask.id, courseId: 4 };
      updatedTask = dao.updateTask(props);
      chai.assert.isOk(updatedTask);
      chai.assert.strictEqual(updatedTask.id, props.id);
      chai.assert.strictEqual(updatedTask.courseId, 4);
    });
    it('should not change properties that are not provided in props object', () => {
      const dao = new TaskMemoryDAO();

      let newTask = dao.newTask({ title: 'some task', courseId: 1 });
      let expected = {
        id: newTask.id,
        title: 'new title',
        courseId: newTask.courseId,
        completed: newTask.completed,
        deadline: newTask.deadline,
        scheduledDate: newTask.scheduledDate,
      };
      let updatedTask = dao.updateTask({ id: newTask.id, title: 'new title' });
      chai.assert.isOk(updatedTask);
      chai.assert.strictEqual(updatedTask.id, expected.id);
      chai.assert.strictEqual(updatedTask.title, expected.title);
      chai.assert.strictEqual(updatedTask.courseId, expected.courseId);
      chai.assert.strictEqual(updatedTask.completed, expected.completed);
      chai.assert.strictEqual(updatedTask.deadline, expected.deadline);

      newTask = dao.newTask({ title: 'some task 2', courseId: 2 });
      expected = {
        id: newTask.id,
        title: newTask.title,
        courseId: 5,
        completed: newTask.completed,
        deadline: newTask.deadline,
        scheduledDate: newTask.scheduledDate,
      };
      updatedTask = dao.updateTask({ id: newTask.id, courseId: 5 });
      chai.assert.isOk(updatedTask);
      chai.assert.strictEqual(updatedTask.id, expected.id);
      chai.assert.strictEqual(updatedTask.title, expected.title);
      chai.assert.strictEqual(updatedTask.courseId, expected.courseId);
      chai.assert.strictEqual(updatedTask.completed, expected.completed);
      chai.assert.strictEqual(updatedTask.deadline, expected.deadline);
    });
    it('should return falsy value if props object parameter is not valid (non existent, empty, or no id)', () => {
      const dao = new TaskMemoryDAO();
      const propsNoId = { title: 'new title', courseId: 'new course', completed: true };
      const nonExistentId = 5555;
      chai.assert.isNotOk(dao.updateTask());
      chai.assert.isNotOk(dao.updateTask({}));
      chai.assert.isNotOk(dao.updateTask(propsNoId));
      chai.assert.isNotOk(dao.updateTask({ id: nonExistentId, courseId: 'new course' }));

      dao.newTask({ title: 'test task1', courseId: 1 });
      dao.newTask({ title: 'test task2', courseId: 1 });
      dao.newTask({ title: 'test task3', courseId: 1 });
      dao.newTask({ title: 'test task4', courseId: 1 });
      dao.newTask({ title: 'test task5', courseId: 1 });

      chai.assert.isNotOk(dao.updateTask());
      chai.assert.isNotOk(dao.updateTask({}));
      chai.assert.isNotOk(dao.updateTask(propsNoId));
      chai.assert.isNotOk(dao.updateTask({ id: nonExistentId, courseId: 2 }));
    });
  });
  describe('deleteById()', () => {
    it('should delete the task with the given id from dao.tasks', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      const deleteId = dao.newTask({ title: 'task to delete', courseId: 1 }).id;
      chai.assert.lengthOf(dao.tasks, 4);

      dao.deleteById(deleteId);
      chai.assert.lengthOf(dao.tasks, 3);

      const stillExists = dao.tasks.reduce((res, task) => res || (task.id === deleteId), false);
      chai.assert.isFalse(stillExists, 'A task with the deleteId still exists in the tasks array');
    });
    it('should not delete any tasks if a task with the given id does not exist', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      chai.assert.lengthOf(dao.tasks, 3);
      const nonExistentId = 5555;

      dao.deleteById(nonExistentId);
      chai.assert.lengthOf(dao.tasks, 3);
    });
    it('should return the deleted task', () => {
      const dao = new TaskMemoryDAO();
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      const deleteId = dao.newTask({ title: 'task to delete', courseId: 1 }).id;

      const deletedTask = dao.deleteById(deleteId);
      chai.assert.isOk(deletedTask);
      chai.assert.strictEqual(deletedTask.id, deleteId);
      chai.assert.strictEqual(deletedTask.title, 'task to delete');
      chai.assert.strictEqual(deletedTask.courseId, 1);
    });
    it('should return falsy value if no task with the given id is found', () => {
      const dao = new TaskMemoryDAO();
      chai.assert.isNotOk(dao.deleteById());
      chai.assert.isNotOk(dao.deleteById(5555));
    });
  });
});
