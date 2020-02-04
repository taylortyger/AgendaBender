const chai = require('chai');

const { assert, expect } = chai;
const TaskMemoryDAO = require('./TaskMemoryDAO');
const InMemoryDataStore = require('./InMemoryDataStore');

describe('In-Memory TaskDAO', () => {
  describe('constructor()', () => {
    it('should have access to the in-memory data store', () => {
      const dao = new TaskMemoryDAO();
      expect(dao.data).to.deep.equal(InMemoryDataStore);
    });

    it('should not be influenced by params', () => {
      const dao = new TaskMemoryDAO(8, 'some string', false);
      expect(dao.data).to.deep.equal(InMemoryDataStore);
    });
  });

  describe('newTask()', () => {
    let dao;
    beforeEach(() => {
      dao = new TaskMemoryDAO();
      dao.data.clear();
    });

    afterEach(() => {
      dao.data.clear();
    });

    it('should result in falsy if Task creation is unsuccessful (no props obj, or no title/course)', () => {
      assert.isNotOk(dao.newTask());
      assert.isNotOk(dao.newTask(null));
      assert.isNotOk(dao.newTask(undefined));
      assert.isNotOk(dao.newTask({}));
      assert.isNotOk(dao.newTask(12));
      assert.isNotOk(dao.newTask(title = 'something', courseId = 1)); // param is not an object

      assert.isNotOk(dao.newTask({ title: 'some task' }));
      assert.isNotOk(dao.newTask({ courseId: 7 }));
      assert.isNotOk(dao.newTask({ title: 'some task', otherProp: 'some other property' }));
      assert.isNotOk(dao.newTask({ courseId: 1, otherProp: 'some other property' }));
      assert.isNotOk(dao.newTask({ title: 'some task', otherProp: 'some other property' }));
    });

    it('should return a successfully created task', () => {
      const task = dao.newTask({ title: 'my task', courseId: 5 });
      assert.isOk(task);
      assert.strictEqual(task.title, 'my task');
      assert.strictEqual(task.courseId, 5);
    });

    it('should set default values for non-required properties', () => {
      const task = dao.newTask({ title: 'my task', courseId: 5 });
      assert.isOk(task);
      assert.isNumber(task.id);
      assert.isNull(task.deadline);
      assert.isFalse(task.completed);
      assert.isNull(task.scheduledDate);
    });

    it('should set all provided properties', () => {
      const props = {
        title: 'my task',
        courseId: 5,
        deadline: 'Jan 4, 2020',
        completed: true,
        scheduledDate: 'Jan 1, 2020',
      };
      const task = dao.newTask(props);
      assert.strictEqual(task.title, 'my task');
      assert.strictEqual(task.courseId, 5);
      assert.strictEqual(task.deadline, 'Jan 4, 2020');
      assert.isTrue(task.completed);
      assert.strictEqual(task.scheduledDate, 'Jan 1, 2020');
    });

    it('should add the new task to the tasks array', () => {
      dao.newTask({ title: 'my task', courseId: 10 });
      assert.lengthOf(dao.data.tasks, 1);
      assert.strictEqual(dao.data.tasks[0].title, 'my task');
      assert.strictEqual(dao.data.tasks[0].courseId, 10);

      dao.newTask({ title: 'my task2', courseId: 3 });
      assert.lengthOf(dao.data.tasks, 2);
      assert.strictEqual(dao.data.tasks[1].title, 'my task2');
      assert.strictEqual(dao.data.tasks[1].courseId, 3);

      dao.newTask({ title: 'my task3', courseId: 6 });
      assert.lengthOf(dao.data.tasks, 3);
      assert.strictEqual(dao.data.tasks[2].title, 'my task3');
      assert.strictEqual(dao.data.tasks[2].courseId, 6);
    });
  });

  describe('Querying', () => {
    describe('find()', () => {
      let dao;
      beforeEach(() => {
        dao = new TaskMemoryDAO();
        dao.data.clear();
      });

      afterEach(() => {
        dao.data.clear();
      });

      it('find returns all tasks when no search criteria is used', () => {
        for (let i = 1; i <= 10; i++) {
          dao.newTask({ title: `some task ${i}`, courseId: i });
        }
        assert.lengthOf(dao.find(), 10);
        assert.lengthOf(dao.find({}), 10);
        assert.lengthOf(dao.find(null), 10);
      });
      it('returns an array of all tasks that exactly match single-attribute criteria', () => {
        dao.newTask({ title: 'task1', courseId: 5, completed: true });
        dao.newTask({ title: 'task2', courseId: 4 });
        dao.newTask({ title: 'task3', courseId: 55 });
        dao.newTask({ title: 'task4', courseId: 5 });
        dao.newTask({ title: 'task5', courseId: 59 });
        dao.newTask({ title: 'task6', courseId: 3 });

        let result = dao.find({ title: 'task4' });
        assert.isArray(result);
        assert.lengthOf(result, 1);

        result = dao.find({ courseId: 5 });
        assert.isArray(result);
        assert.lengthOf(result, 2);

        result = dao.find({ completed: true });
        assert.isArray(result);
        assert.lengthOf(result, 1);

        result = dao.find({ completed: false });
        assert.isArray(result);
        assert.lengthOf(result, 5);
      });
      it('returns an array of all tasks that exactly match multi-attribute criteria', () => {
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
        assert.isArray(result);
        assert.lengthOf(result, 1);

        result = dao.find({ courseId: 3, completed: true });
        assert.isArray(result);
        assert.lengthOf(result, 1);

        result = dao.find({ courseId: 3, completed: false });
        assert.isArray(result);
        assert.lengthOf(result, 3);

        result = dao.find({ title: 'task9', completed: false });
        assert.isArray(result);
        assert.lengthOf(result, 1);
      });
      it('returns an empty array if no tasks exactly match all the criteria', () => {
        dao.newTask({ title: 'task1', courseId: 5, completed: true });
        dao.newTask({ title: 'task2', courseId: 4 });
        dao.newTask({ title: 'task3', courseId: 55 });
        dao.newTask({ title: 'task4', courseId: 5 });
        dao.newTask({ title: 'task5', courseId: 59 });
        dao.newTask({ title: 'task6', courseId: 3 });

        let result = dao.find({ title: 'task8' });
        assert.isArray(result);
        assert.isEmpty(result);

        result = dao.find({ title: 'task1', courseId: 40 });
        assert.isArray(result);
        assert.isEmpty(result);

        result = dao.find({ title: 'task1', courseId: 5, completed: false });
        assert.isArray(result);
        assert.isEmpty(result);

        result = dao.find({ courseId: 500 });
        assert.isArray(result);
        assert.isEmpty(result);

        result = dao.find({ courseId: 4, completed: true });
        assert.isArray(result);
        assert.isEmpty(result);
      });
    });
    describe('findById()', () => {
      let dao;
      beforeEach(() => {
        dao = new TaskMemoryDAO();
        dao.data.clear();
      });

      afterEach(() => {
        dao.data.clear();
      });

      it('returns a task with the given id if it exists in the tasks array', () => {
        let newTask = dao.newTask({ title: 'some task', courseId: 1 });
        let resultTask = dao.findById(newTask.id);
        expect(resultTask).to.be.ok;
        expect(resultTask).to.be.deep.equal(resultTask);

        newTask = dao.newTask({ title: 'some task2', courseId: 2 });
        resultTask = dao.findById(newTask.id);
        expect(resultTask).to.be.ok;
        expect(resultTask).to.be.deep.equal(resultTask);

        newTask = dao.newTask({ title: 'some task3', courseId: 3 });
        resultTask = dao.findById(newTask.id);
        expect(resultTask).to.be.ok;
        expect(resultTask).to.be.deep.equal(resultTask);
      });
      it('returns falsy value if a task with the given id does not exist in the tasks array', () => {
        // no tasks added yet
        expect(dao.findById(50)).to.not.be.ok;
        expect(dao.findById(0)).to.not.be.ok;
        expect(dao.findById(1)).to.not.be.ok;

        // with tasks added to tasks array
        dao.newTask({ title: 't1', courseId: 1 });
        dao.newTask({ title: 't2', courseId: 2 });
        dao.newTask({ title: 't3', courseId: 3 });
        dao.newTask({ title: 't4', courseId: 4 });

        expect(dao.findById(dao.maxId + 5)).to.not.be.ok;
      });
    });
  });
  describe('updateTask()', () => {
    let dao;
    beforeEach(() => {
      dao = new TaskMemoryDAO();
      dao.data.clear();
    });

    afterEach(() => {
      dao.data.clear();
    });

    it('should update the provided task properties when a task with the given id exists', () => {
      let newTask = dao.newTask({ title: 'some task', courseId: 1 });
      let props = {
        id: newTask.id,
        title: 'new title',
        courseId: 2,
        completed: true,
        deadline: 'December 20, 2020',
      };
      let updatedTask = dao.updateTask(props);
      assert.isOk(updatedTask);
      assert.strictEqual(updatedTask.id, props.id);
      assert.strictEqual(updatedTask.title, 'new title');
      assert.strictEqual(updatedTask.courseId, 2);
      assert.isTrue(updatedTask.completed);
      assert.strictEqual(updatedTask.deadline, 'December 20, 2020');

      newTask = dao.newTask({ title: 'some task 2', courseId: 2 });
      props = { id: newTask.id, title: 'new title 2' };
      updatedTask = dao.updateTask(props);
      assert.isOk(updatedTask);
      assert.strictEqual(updatedTask.id, props.id);
      assert.strictEqual(updatedTask.title, 'new title 2');

      newTask = dao.newTask({ title: 'some task 3', courseId: 3 });
      props = { id: newTask.id, courseId: 4 };
      updatedTask = dao.updateTask(props);
      assert.isOk(updatedTask);
      assert.strictEqual(updatedTask.id, props.id);
      assert.strictEqual(updatedTask.courseId, 4);
    });
    it('should not change properties that are not provided in props object', () => {
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
      assert.isOk(updatedTask);
      assert.strictEqual(updatedTask.id, expected.id);
      assert.strictEqual(updatedTask.title, expected.title);
      assert.strictEqual(updatedTask.courseId, expected.courseId);
      assert.strictEqual(updatedTask.completed, expected.completed);
      assert.strictEqual(updatedTask.deadline, expected.deadline);

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
      assert.isOk(updatedTask);
      assert.strictEqual(updatedTask.id, expected.id);
      assert.strictEqual(updatedTask.title, expected.title);
      assert.strictEqual(updatedTask.courseId, expected.courseId);
      assert.strictEqual(updatedTask.completed, expected.completed);
      assert.strictEqual(updatedTask.deadline, expected.deadline);
    });
    it('should return falsy value if props object parameter is not valid (non existent, empty, or no id)', () => {
      const propsNoId = { title: 'new title', courseId: 'new course', completed: true };
      const nonExistentId = 5555;
      assert.isNotOk(dao.updateTask());
      assert.isNotOk(dao.updateTask({}));
      assert.isNotOk(dao.updateTask(propsNoId));
      assert.isNotOk(dao.updateTask({ id: nonExistentId, courseId: 'new course' }));

      dao.newTask({ title: 'test task1', courseId: 1 });
      dao.newTask({ title: 'test task2', courseId: 1 });
      dao.newTask({ title: 'test task3', courseId: 1 });
      dao.newTask({ title: 'test task4', courseId: 1 });
      dao.newTask({ title: 'test task5', courseId: 1 });

      assert.isNotOk(dao.updateTask());
      assert.isNotOk(dao.updateTask({}));
      assert.isNotOk(dao.updateTask(propsNoId));
      assert.isNotOk(dao.updateTask({ id: nonExistentId, courseId: 2 }));
    });
  });
  describe('deleteById()', () => {
    let dao;
    beforeEach(() => {
      dao = new TaskMemoryDAO();
      dao.data.clear();
    });

    afterEach(() => {
      dao.data.clear();
    });

    it('should delete the task with the given id from dao.data.tasks', () => {
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      const deleteId = dao.newTask({ title: 'task to delete', courseId: 1 }).id;
      assert.lengthOf(dao.data.tasks, 4);

      dao.deleteById(deleteId);
      assert.lengthOf(dao.data.tasks, 3);

      const stillExists = dao.data.tasks.reduce((res, task) => res || (task.id === deleteId), false);
      assert.isFalse(stillExists, 'A task with the deleteId still exists in the tasks array');
    });
    it('should not delete any tasks if a task with the given id does not exist', () => {
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      assert.lengthOf(dao.data.tasks, 3);
      const nonExistentId = 5555;

      dao.deleteById(nonExistentId);
      assert.lengthOf(dao.data.tasks, 3);
    });
    it('should return the deleted task', () => {
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      dao.newTask({ title: 'task 1', courseId: 1 });
      const deleteId = dao.newTask({ title: 'task to delete', courseId: 1 }).id;

      const deletedTask = dao.deleteById(deleteId);
      assert.isOk(deletedTask);
      assert.strictEqual(deletedTask.id, deleteId);
      assert.strictEqual(deletedTask.title, 'task to delete');
      assert.strictEqual(deletedTask.courseId, 1);
    });
    it('should return falsy value if no task with the given id is found', () => {
      assert.isNotOk(dao.deleteById());
      assert.isNotOk(dao.deleteById(5555));
    });
  });
});
