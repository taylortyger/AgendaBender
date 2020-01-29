/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const InMemoryDataStore = require('../data/InMemoryDataStore');
const seed = require('./seed');

const getUniqueCourses = (tasks) => tasks.reduce((courseList, task) => {
  if (!courseList.includes(task.courseId)) courseList.push(task.courseId);
  return courseList;
}, []);

describe('Seed In Memory Database', () => {
  describe('seed()', () => {
    afterEach(() => {
      InMemoryDataStore.clear();
    });
    it('should seed the in memory datastore with 10 tasks by default', () => {
      seed();
      chai.assert.isNotNull(InMemoryDataStore.tasks);
      chai.assert.lengthOf(InMemoryDataStore.tasks, 10);
    });
    it('should take a number as an argument to determine the number of tasks to generate', () => {
      seed(100);
      chai.assert.isNotNull(InMemoryDataStore.tasks);
      chai.assert.lengthOf(InMemoryDataStore.tasks, 100);
    });
    it('should support an argument to determine the number of unique course names to generate tasks under', () => {
      seed(100, 5);
      chai.assert.isNotNull(InMemoryDataStore.tasks);
      const uniqueCourses = getUniqueCourses(InMemoryDataStore.tasks);
      chai.assert.lengthOf(uniqueCourses, 5);
    });
    it('should default to generating tasks under 4 unique course names', () => {
      seed(100);
      chai.assert.isNotNull(InMemoryDataStore.tasks);
      const uniqueCourses = getUniqueCourses(InMemoryDataStore.tasks);
      chai.assert.lengthOf(uniqueCourses, 4);
    });
    it('should generate the same number of unique courses as the number of tasks when numberOfCourses > numberOfTasks', () => {
      seed(5, 6);
      chai.assert.isNotNull(InMemoryDataStore.tasks);
      const uniqueCourses = getUniqueCourses(InMemoryDataStore.tasks);
      chai.assert.lengthOf(uniqueCourses, 5);
    });
  });
});
