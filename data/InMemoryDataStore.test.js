const chai = require('chai');

const { expect } = chai;
const InMemoryDataStore = require('./InMemoryDataStore');

const Course = require('./Course');

describe('InMemoryDataStore', () => {
  describe('clear', () => {
    it('should clear contents and restore default of the data store', () => {
      InMemoryDataStore.courses = [1, 2, 3];
      InMemoryDataStore.tasks = [1, 2, 3];
      InMemoryDataStore.maxCourseId = 3;
      InMemoryDataStore.maxTaskId = 3;
      expect(InMemoryDataStore.courses).to.have.lengthOf(3);
      expect(InMemoryDataStore.tasks).to.have.lengthOf(3);
      expect(InMemoryDataStore.maxCourseId).to.equal(3);
      expect(InMemoryDataStore.maxTaskId).to.equal(3);
      InMemoryDataStore.clear();
      expect(InMemoryDataStore.courses).to.have.lengthOf(0);
      expect(InMemoryDataStore.tasks).to.have.lengthOf(0);
      expect(InMemoryDataStore.maxCourseId).to.equal(0);
      expect(InMemoryDataStore.maxTaskId).to.equal(0);
    });
  });
});