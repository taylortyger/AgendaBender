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
      chai.except(dao.courses).to.be.empty();
      chai.expect(dao.maxCourseId).to.be.equal(0);
    });
  });
});
