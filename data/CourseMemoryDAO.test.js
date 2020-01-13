/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const CourseMemoryDAO = require('./CourseMemoryDAO');

describe('CourseMemoryDAO', () => {
  describe('construction', () => {
    it('Should initialize with an empty course array and a maxCourseId of 0', () => {
      const dao = new CourseMemoryDAO();
      chai.expect(dao.courses).to.be.instanceOf(Array);
      chai.expect(dao.courses).to.be.empty;
      chai.expect(dao.maxCourseId).to.be.equal(0);
    });
    it('Should not be affected by parameters', () => {
      const dao = new CourseMemoryDAO([1, 2, 3], false, 'test');
      chai.expect(dao.courses).to.be.instanceOf(Array);
      chai.expect(dao.courses).to.be.empty;
      chai.expect(dao.maxCourseId).to.be.equal(0);
    });
  });
  describe('newCourse()', () => {
    it('Should add a new course with the provided title to the courses array', () => {

    });
  });
});
