/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const TaskMemoryDAO = require('./TaskMemoryDAO');
const TaskRepository = require('./TaskRepository');

describe('TaskRepository', () => {
  describe('getAll()', () => {
    it('should return an empty array if no tasks exist', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      const result = repo.getAll();
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 0);
    });
    it('should return an array of all tasks', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      repo.newTask({ title: 'Task 4', course: 'TEST1234' });
      const result = repo.getAll();
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 4);
    });
  });
  describe('getById()', () => {
    it('should return the task with the given id', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      const taskToFind = repo.newTask({ title: 'Task 4', course: 'FOUND1234' });
      const result = repo.getById(taskToFind.id);
      chai.assert.isNotNull(result);
      chai.assert.strictEqual(result.title, 'Task 4');
      chai.assert.strictEqual(result.course, 'FOUND1234');
    });
    it('should return null if a task with the given id does not exist', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      chai.assert.isNull(repo.getById());
      chai.assert.isNull(repo.getById(10));
      chai.assert.isNull(repo.getById({}));
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      chai.assert.isNull(repo.getById());
      chai.assert.isNull(repo.getById(9999));
      chai.assert.isNull(repo.getById({ id: 10 }));
    });
  });
  describe('update()', () => {
    it('should return the updated task', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      const updateId = repo.newTask({ title: 'UPDATE ME', course: 'UPDATE1234' }).id;
      const result = repo.update({ id: updateId, title: 'new title', course: 'NEW1234' });
      chai.assert.isNotNull(result);
      chai.assert.strictEqual(result.id, updateId);
    });
    it('should update any provided valid fields', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      const updateId = repo.newTask({ title: 'UPDATE ME', course: 'UPDATE1234' }).id;
      const result = repo.update({ id: updateId, title: 'new title', course: 'NEW1234' });
      chai.assert.isNotNull(result);
      chai.assert.strictEqual(result.id, updateId);
      chai.assert.strictEqual(result.title, 'new title');
      chai.assert.strictEqual(result.course, 'NEW1234');
    });
    it('should return null if update is unsuccessful (no props object, no id field, task does not exist)', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      repo.newTask({ title: 'Task 4', course: 'TEST1234' });
      chai.assert.isNull(repo.update());
      chai.assert.isNull(repo.update({}));
      chai.assert.isNull(repo.update({ id: 12345 }));
    });
  });
  describe('getByCourse()', () => {
    it('should return an array of all tasks matching the provided course', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      repo.newTask({ title: 'Task 4', course: 'TEST1234' });
      repo.newTask({ title: 'Task 1', course: 'TEST5678' });
      repo.newTask({ title: 'Task 2', course: 'TEST5678' });
      repo.newTask({ title: 'Task 3', course: 'TEST5678' });
      let result = repo.getByCourse('TEST1234');
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 4);

      result = repo.getByCourse('TEST5678');
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 3);
    });
    it('should return an empty array if no tasks match the course', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      chai.assert.isArray(repo.getByCourse());
      chai.assert.isEmpty(repo.getByCourse());
      chai.assert.isArray(repo.getByCourse('TEST1234'));
      chai.assert.isEmpty(repo.getByCourse('TEST1234'));

      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      repo.newTask({ title: 'Task 4', course: 'TEST1234' });
      repo.newTask({ title: 'Task 1', course: 'TEST5678' });
      repo.newTask({ title: 'Task 2', course: 'TEST5678' });
      repo.newTask({ title: 'Task 3', course: 'TEST5678' });
      chai.assert.isArray(repo.getByCourse());
      chai.assert.isEmpty(repo.getByCourse());
      chai.assert.isArray(repo.getByCourse('NONEXISTENTCOURSE'));
      chai.assert.isEmpty(repo.getByCourse('NONEXISTENTCOURSE'));
    });
  });
  describe('newTask()', () => {
    it('should return the created task', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      const result = repo.newTask({ title: 'new task', course: 'TEST1234' });
      chai.assert.isNotNull(result);
      chai.assert.strictEqual(result.title, 'new task');
      chai.assert.strictEqual(result.course, 'TEST1234');
    });
    it('should add the new task to the DAO', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      const newTask = repo.newTask({ title: 'new task', course: 'TEST1234' });
      const result = repo.getById(newTask.id);
      chai.assert.isNotNull(result);
      chai.assert.strictEqual(result.title, 'new task');
      chai.assert.strictEqual(result.course, 'TEST1234');
    });
    it('should return null if task creation is unsuccessful', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      chai.assert.isNull(repo.newTask());
      chai.assert.isNull(repo.newTask({}));
      chai.assert.isNull(repo.newTask({ title: 'new task' }));
      chai.assert.isNull(repo.newTask({ course: 'TEST1234' }));
    });
  });
  describe('deleteById()', () => {
    it('should return the deleted task', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      const taskToDelete = repo.newTask({ title: 'Task 4', course: 'TEST1234' });
      const result = repo.deleteById(taskToDelete.id);
      chai.assert.isNotNull(result);
      chai.assert.isObject(result);
      chai.assert.strictEqual(result.title, 'Task 4');
      chai.assert.strictEqual(result.course, 'TEST1234');
    });
    it('should remove the task with the given id from the DAO', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      const taskToDelete = repo.newTask({ title: 'Task 4', course: 'TEST1234' });
      chai.assert.isNotNull(repo.getById(taskToDelete.id));
      const result = repo.deleteById(taskToDelete.id);
      chai.assert.isNull(repo.getById(taskToDelete.id));
    });
    it('should return null if task deletion is unsuccessful (task not found, id not provided)', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', course: 'TEST1234' });
      repo.newTask({ title: 'Task 2', course: 'TEST1234' });
      repo.newTask({ title: 'Task 3', course: 'TEST1234' });
      chai.assert.isNull(repo.deleteById());
      chai.assert.isNull(repo.deleteById(12345));
      chai.assert.isNull(repo.deleteById({}));
    });
  });
});
