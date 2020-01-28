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
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      repo.newTask({ title: 'Task 4', courseId: 1 });
      const result = repo.getAll();
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 4);
    });
  });
  describe('getById()', () => {
    it('should return the task with the given id', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      const taskToFind = repo.newTask({ title: 'Task 4', courseId: 4 });
      const result = repo.getById(taskToFind.id);
      chai.assert.isOk(result);
      chai.assert.strictEqual(result.title, 'Task 4');
      chai.assert.strictEqual(result.courseId, 4);
    });
    it('should return falsy if a task with the given id does not exist', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      chai.assert.isNotOk(repo.getById());
      chai.assert.isNotOk(repo.getById(10));
      chai.assert.isNotOk(repo.getById({}));
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      chai.assert.isNotOk(repo.getById());
      chai.assert.isNotOk(repo.getById(9999));
      chai.assert.isNotOk(repo.getById({ id: 10 }));
    });
  });
  describe('update()', () => {
    it('should return the updated task', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      const updateId = repo.newTask({ title: 'UPDATE ME', courseId: 4 }).id;
      const result = repo.update({ id: updateId, title: 'new title', courseId: 7 });
      chai.assert.isOk(result);
      chai.assert.strictEqual(result.id, updateId);
    });
    it('should update any provided valid fields', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      const updateId = repo.newTask({ title: 'UPDATE ME', courseId: 4 }).id;
      const result = repo.update({ id: updateId, title: 'new title', courseId: 5 });
      chai.assert.isOk(result);
      chai.assert.strictEqual(result.id, updateId);
      chai.assert.strictEqual(result.title, 'new title');
      chai.assert.strictEqual(result.courseId, 5);
    });
    it('should return null if update is unsuccessful (no props object, no id field, task does not exist)', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      repo.newTask({ title: 'Task 4', courseId: 1 });
      chai.assert.isNotOk(repo.update());
      chai.assert.isNotOk(repo.update({}));
      chai.assert.isNotOk(repo.update({ id: 12345 }));
    });
  });
  describe('getByCourseId()', () => {
    it('should return an array of all tasks matching the provided course', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      repo.newTask({ title: 'Task 4', courseId: 1 });
      repo.newTask({ title: 'Task 1', courseId: 5 });
      repo.newTask({ title: 'Task 2', courseId: 5 });
      repo.newTask({ title: 'Task 3', courseId: 5 });
      let result = repo.getByCourseId(1);
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 4);

      result = repo.getByCourseId(5);
      chai.assert.isArray(result);
      chai.assert.lengthOf(result, 3);
    });
    it('should return an empty array if no tasks match the course', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      chai.assert.isArray(repo.getByCourseId());
      chai.assert.isEmpty(repo.getByCourseId());
      chai.assert.isArray(repo.getByCourseId(1));
      chai.assert.isEmpty(repo.getByCourseId(1));

      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      repo.newTask({ title: 'Task 4', courseId: 1 });
      repo.newTask({ title: 'Task 1', courseId: 5 });
      repo.newTask({ title: 'Task 2', courseId: 5 });
      repo.newTask({ title: 'Task 3', courseId: 5 });
      chai.assert.isArray(repo.getByCourseId());
      chai.assert.isEmpty(repo.getByCourseId());
      chai.assert.isArray(repo.getByCourseId(777));
      chai.assert.isEmpty(repo.getByCourseId(777));
    });
  });
  describe('newTask()', () => {
    it('should return the created task', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      const result = repo.newTask({ title: 'new task', courseId: 1 });
      chai.assert.isOk(result);
      chai.assert.strictEqual(result.title, 'new task');
      chai.assert.strictEqual(result.courseId, 1);
    });
    it('should add the new task to the DAO', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      const newTask = repo.newTask({ title: 'new task', courseId: 1 });
      const result = repo.getById(newTask.id);
      chai.assert.isOk(result);
      chai.assert.strictEqual(result.title, 'new task');
      chai.assert.strictEqual(result.courseId, 1);
    });
    it('should return falsy if task creation is unsuccessful', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      chai.assert.isNotOk(repo.newTask());
      chai.assert.isNotOk(repo.newTask({}));
      chai.assert.isNotOk(repo.newTask({ title: 'new task' }));
      chai.assert.isNotOk(repo.newTask({ courseId: 1 }));
    });
  });
  describe('deleteById()', () => {
    it('should return the deleted task', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      const taskToDelete = repo.newTask({ title: 'Task 4', courseId: 1 });
      const result = repo.deleteById(taskToDelete.id);
      chai.assert.isOk(result);
      chai.assert.isObject(result);
      chai.assert.strictEqual(result.title, 'Task 4');
      chai.assert.strictEqual(result.courseId, 1);
    });
    it('should remove the task with the given id from the DAO', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      const taskToDelete = repo.newTask({ title: 'Task 4', courseId: 1 });
      chai.assert.isOk(repo.getById(taskToDelete.id));
      const result = repo.deleteById(taskToDelete.id);
      chai.assert.isNotOk(repo.getById(taskToDelete.id));
    });
    it('should return falsy if task deletion is unsuccessful (task not found, id not provided)', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      repo.newTask({ title: 'Task 1', courseId: 1 });
      repo.newTask({ title: 'Task 2', courseId: 1 });
      repo.newTask({ title: 'Task 3', courseId: 1 });
      chai.assert.isNotOk(repo.deleteById());
      chai.assert.isNotOk(repo.deleteById(12345));
      chai.assert.isNotOk(repo.deleteById({}));
    });
  });
});
