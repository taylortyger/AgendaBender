/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const TaskMemoryDAO = require('../data/TaskMemoryDAO');
const TaskRepository = require('../data/TaskRepository');
const seed = require('./seed');

describe('Seed In Memory Database', () => {
  describe('seed()', () => {
    it('should seed the repository with 10 tasks by default', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      seed(repo);
      chai.assert.isNotNull(repo.getAll());
      chai.assert.lengthOf(repo.getAll(), 10);
    });
    it('should take a number as an argument to determine the number of tasks to generate', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      seed(repo, 100);
      chai.assert.isNotNull(repo.getAll());
      chai.assert.lengthOf(repo.getAll(), 100);
    });
  });
});
