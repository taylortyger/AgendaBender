/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const TaskMemoryDAO = require('./TaskMemoryDAO');
const TaskRepository = require('./TaskRepository');

describe('TaskRepository', () => {
  describe('getAll()', () => {
    it('should return an empty array if no tasks exist', () => {});
    it('should return an array of all tasks', () => {});
  });
  describe('getById()', () => {
    it('should return the task with the given id', () => {});
    it('should return null if a task with the given id does not exist', () => {});
  });
  describe('update()', () => {
    it('should return the updated task', () => {});
    it('should update any provided valid fields', () => {});
    it('should return null if update is unsuccessful (no props object, no id field, task does not exist)', () => {

    });
  });
  describe('getByCourse()', () => {
    it('should return an array of all tasks matching the provided course', () => {

    });
    it('should return an empty array if no tasks match the course', () => {

    });
  });
  describe('newTask()', () => {
    it('should return the created task', () => {

    });
    it('should add the new task to the DAO', () => {

    });
    it('should return null if task creation is unsuccessful', () => {

    });
  });
  describe('deleteById()', () => {
    it('should return the deleted task', () => {

    });
    it('should remove the task with the given id from the DAO', () => {

    });
    it('should return null if task deletion is unsuccessful (task not found, id not provided)', () => {

    });
  });
});
