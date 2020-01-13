/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const chai = require('chai');

const should = chai.should();
const CourseMemoryDAO = require('./CourseMemoryDAO');

const Course = require('./Course');

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
    it('Should add the new course to the courses array', () => {
      const dao = new CourseMemoryDAO();
      chai.expect(dao.courses).to.have.lengthOf(0);
      dao.newCourse('COURSE1');
      chai.expect(dao.courses).to.have.lengthOf(1);
      dao.newCourse('COURSE2');
      chai.expect(dao.courses).to.have.lengthOf(2);
    });
    it('Should increment the maxCourseId by 1 to ensure uniqueness', () => {
      const dao = new CourseMemoryDAO();
      chai.expect(dao.maxCourseId).to.equal(0);
      dao.newCourse('COURSE1');
      chai.expect(dao.maxCourseId).to.equal(1);
      dao.newCourse('COURSE2');
      chai.expect(dao.maxCourseId).to.equal(2);
    });
    it('Should return a successfully created course', () => {
      const dao = new CourseMemoryDAO();
      const createdCourse = dao.newCourse('COURSE1');
      chai.expect(createdCourse).to.be.ok;
      chai.expect(createdCourse).to.haveOwnProperty('title');
      chai.expect(createdCourse.title).to.be.equal('COURSE1');
    });
    it('Should return falsy if course creation is not successful', () => {
      const dao = new CourseMemoryDAO();
      chai.expect(dao.newCourse()).to.not.be.ok;
      chai.expect(dao.newCourse({})).to.not.be.ok;
      chai.expect(dao.newCourse({ title: 'COURSE1' })).to.not.be.ok;
      chai.expect(dao.newCourse(12345)).to.not.be.ok;
      chai.expect(dao.newCourse(true)).to.not.be.ok;
    });
  });
  describe('find', () => {
    let dao;
    beforeEach(() => {
      dao = new CourseMemoryDAO();
      dao.newCourse('COURSE1');
      dao.newCourse('COURSE2');
      dao.newCourse('COURSE3');
      dao.newCourse('COURSE4');
      dao.newCourse('COURSE5');
    });
    it('Should return an array of all courses if no criteria is provided', () => {
      chai.expect(dao.find()).to.be.an.instanceOf(Array).and.to.have.lengthOf(5);
      chai.expect(dao.find({})).to.be.an.instanceOf(Array).and.to.have.lengthOf(5);
      chai.expect(dao.find(null)).to.be.an.instanceOf(Array).and.to.have.lengthOf(5);
      chai.expect(dao.find(undefined)).to.be.an.instanceOf(Array).and.to.have.lengthOf(5);
    });
    it('Should return an array of all courses that match the criteria', () => {
      chai.expect(dao.find({ title: 'COURSE1' })).to.be.an.instanceOf(Array).and.to.have.lengthOf(1);
      chai.expect(dao.find({ id: 2 })).to.be.an.instanceOf(Array).and.to.have.lengthOf(1);
      chai.expect(dao.find({ title: 'COURSE2' })).to.be.an.instanceOf(Array).and.to.have.lengthOf(1);
      chai.expect(dao.find({ title: 'COURSE5' })).to.be.an.instanceOf(Array).and.to.have.lengthOf(1);
    });
    it('Should return an empty array if no courses match the criteria', () => {
      chai.expect(dao.find({ title: 'COURSE12345' })).to.be.an.instanceOf(Array).and.to.be.empty;
      chai.expect(dao.find({ title: 'COURSE12' })).to.be.an.instanceOf(Array).and.to.be.empty;
      chai.expect(dao.find({ id: 12345 })).to.be.an.instanceOf(Array).and.to.be.empty;
      chai.expect(dao.find({ randomProp: true })).to.be.an.instanceOf(Array).and.to.be.empty;
    });
  });
  describe('findById', () => {
    let dao;
    beforeEach(() => {
      dao = new CourseMemoryDAO();
      dao.newCourse('COURSE1');
      dao.newCourse('COURSE2');
      dao.newCourse('COURSE3');
      dao.newCourse('COURSE4');
      dao.newCourse('COURSE5');
    });
    it('Should return the course with the given id if it exists in the courses array', () => {
      chai.expect(dao.findById(1)).to.be.an.instanceOf(Course);
      chai.expect(dao.findById(1).title).to.be.equal('COURSE1');

      chai.expect(dao.findById(2)).to.be.an.instanceOf(Course);
      chai.expect(dao.findById(2).title).to.be.equal('COURSE2');

      chai.expect(dao.findById(3)).to.be.an.instanceOf(Course);
      chai.expect(dao.findById(3).title).to.be.equal('COURSE3');
    });
    it('Should return falsy if the course with the given id does not exist in the courses array', () => {
      chai.expect(dao.findById(1111)).to.not.be.ok;
      chai.expect(dao.findById(555)).to.not.be.ok;
      chai.expect(dao.findById()).to.not.be.ok;
    });
  });
});
