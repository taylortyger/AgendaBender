/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const InMemoryDataStore = require('./InMemoryDataStore');

const Course = require('./Course');

describe('InMemoryDataStore', () => {
  describe('clear', () => {
    it('should clear contents and restore default of the data store', () => {
      InMemoryDataStore.courses = [1, 2, 3];
      InMemoryDataStore.tasks = [1, 2, 3];
      InMemoryDataStore.maxCourseId = 3;
      InMemoryDataStore.maxTaskId = 3;
      chai.expect(InMemoryDataStore.courses).to.have.lengthOf(3);
      chai.expect(InMemoryDataStore.tasks).to.have.lengthOf(3);
      chai.expect(InMemoryDataStore.maxCourseId).to.equal(3);
      chai.expect(InMemoryDataStore.maxTaskId).to.equal(3);
      InMemoryDataStore.clear();
      chai.expect(InMemoryDataStore.courses).to.have.lengthOf(0);
      chai.expect(InMemoryDataStore.tasks).to.have.lengthOf(0);
      chai.expect(InMemoryDataStore.maxCourseId).to.equal(0);
      chai.expect(InMemoryDataStore.maxTaskId).to.equal(0);
    });
  });
});