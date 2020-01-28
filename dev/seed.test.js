/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const TaskMemoryDAO = require('../data/TaskMemoryDAO');
const TaskRepository = require('../data/TaskRepository');
const seed = require('./seed');

const getUniqueCourses = (tasks) => tasks.reduce((courseList, task) => {
  if (!courseList.includes(task.courseId)) courseList.push(task.courseId);
  return courseList;
}, []);

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
    it('should support an argument to determine the number of unique course names to generate tasks under', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      seed(repo, 100, 5);
      const tasks = repo.getAll();
      chai.assert.isNotNull(tasks);

      const uniqueCourses = getUniqueCourses(tasks);
      chai.assert.lengthOf(uniqueCourses, 5);
    });
    it('should default to generating tasks under 4 unique course names', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      seed(repo, 100);
      const tasks = repo.getAll();
      chai.assert.isNotNull(tasks);

      const uniqueCourses = getUniqueCourses(tasks);
      chai.assert.lengthOf(uniqueCourses, 4);
    });
    it('should generate the same number of unique courses as the number of tasks when numberOfCourses > numberOfTasks', () => {
      const repo = new TaskRepository(new TaskMemoryDAO());
      seed(repo, 5, 6);
      const tasks = repo.getAll();
      chai.assert.isNotNull(tasks);
      const uniqueCourses = getUniqueCourses(tasks);
      chai.assert.lengthOf(uniqueCourses, 5);
    });
  });
});
