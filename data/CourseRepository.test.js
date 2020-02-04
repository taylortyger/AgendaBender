const chai = require('chai');

const { expect } = chai;
const CourseMemoryDAO = require('./CourseMemoryDAO');
const CourseRepository = require('./CourseRepository');
const InMemoryDataStore = require('./InMemoryDataStore');
const Course = require('./Course');

describe('CourseRepository', () => {
  describe('construction', () => {
    it('should initialize with the passed in dao', () => {
      const courseRepo = new CourseRepository(new CourseMemoryDAO());
      expect(courseRepo.dao).to.be.an.instanceOf(CourseMemoryDAO);
    });
  });

  describe('getAll', () => {
    const courseRepo = new CourseRepository(new CourseMemoryDAO());
    InMemoryDataStore.clear();

    afterEach(() => {
      InMemoryDataStore.clear();
    });

    it('should return an empty array if no courses exist', () => {
      const result = courseRepo.getAll();
      expect(result).to.be.an.instanceOf(Array).and.to.be.empty;
    });

    it('should return an array of all courses', () => {
      courseRepo.newCourse('Course 1');
      courseRepo.newCourse('Course 2');
      courseRepo.newCourse('Course 3');
      const result = courseRepo.getAll();
      expect(result).to.be.an.instanceOf(Array).and.to.have.lengthOf(3);
    });
  });

  describe('getById', () => {
    const courseRepo = new CourseRepository(new CourseMemoryDAO());
    InMemoryDataStore.clear();

    beforeEach(() => {
      courseRepo.newCourse('Course 1');
      courseRepo.newCourse('Course 2');
      courseRepo.newCourse('Course 3');
    });

    afterEach(() => {
      InMemoryDataStore.clear();
    });

    it('should return the course', () => {
      const result = courseRepo.getById(1);
      expect(result).to.be.an.instanceOf(Course);
      expect(result.id).to.be.equal(1);
    });

    it('should return falsy if the course with the given id does not exist', () => {
      let result = courseRepo.getById(-1);
      expect(result).to.not.be.ok;
      result = courseRepo.getById(999999);
      expect(result).to.not.be.ok;
    });
  });

  describe('update', () => {
    const courseRepo = new CourseRepository(new CourseMemoryDAO());
    InMemoryDataStore.clear();

    beforeEach(() => {
      courseRepo.newCourse('Course 1');
      courseRepo.newCourse('Course 2');
      courseRepo.newCourse('Course 3');
    });

    afterEach(() => {
      InMemoryDataStore.clear();
    });

    it('should return the updated course', () => {
      const result = courseRepo.update({ id: 2 });
      expect(result).to.be.an.instanceOf(Course);
      expect(result.id).to.be.equal(2);
    });

    it('should throw an error if id is not provided', () => {
      expect(() => courseRepo.update()).to.throw('Updating requires a valid course id');
      expect(() => courseRepo.update('.jr3')).to.throw('Updating requires a valid course id');
      expect(() => courseRepo.update('33')).to.throw('Updating requires a valid course id');
      expect(() => courseRepo.update(null)).to.throw('Updating requires a valid course id');
      expect(() => courseRepo.update(undefined)).to.throw('Updating requires a valid course id');
      expect(() => courseRepo.update({})).to.throw('Updating requires a valid course id');
      expect(() => courseRepo.update(true)).to.throw('Updating requires a valid course id');
      expect(() => courseRepo.update(false)).to.throw('Updating requires a valid course id');
    });

    it('should return falsy if course with the given id does not exist', () => {
      let result = courseRepo.update({ id: 777777 });
      expect(result).to.not.be.ok;
      result = courseRepo.update({ id: -1 });
      expect(result).to.not.be.ok;
    });
  });

  describe('newCourse', () => {
    const courseRepo = new CourseRepository(new CourseMemoryDAO());
    InMemoryDataStore.clear();

    afterEach(() => {
      InMemoryDataStore.clear();
    });
    it('should return the new course', () => {
      const result = courseRepo.newCourse('Course 1');
      expect(result).to.be.an.instanceOf(Course);
      expect(result.title).to.be.equal('Course 1');
    });

    it('should add the new course to the datastore/database', () => {
      const newCourseId = courseRepo.newCourse('Course 1').id;
      const result = courseRepo.getById(newCourseId);
      expect(result).to.be.an.instanceOf(Course);
      expect(result.title).to.be.equal('Course 1');
    });

    it('should throw an error if the title is not valid', () => {
      expect(() => courseRepo.newCourse()).to.throw('Courses must have a valid title');
      expect(() => courseRepo.newCourse(true)).to.throw('Courses must have a valid title');
      expect(() => courseRepo.newCourse(false)).to.throw('Courses must have a valid title');
      expect(() => courseRepo.newCourse(1234)).to.throw('Courses must have a valid title');
      expect(() => courseRepo.newCourse({})).to.throw('Courses must have a valid title');
      expect(() => courseRepo.newCourse({ title: 'Course 1' })).to.throw('Courses must have a valid title');
    });
  });

  describe('deleteById', () => {
    const courseRepo = new CourseRepository(new CourseMemoryDAO());
    InMemoryDataStore.clear();

    beforeEach(() => {
      courseRepo.newCourse('Course 1');
      courseRepo.newCourse('Course 2');
      courseRepo.newCourse('Course 3');
    });

    afterEach(() => {
      InMemoryDataStore.clear();
    });

    it('should return the deleted course', () => {
      const deleteId = courseRepo.newCourse('Course to Delete').id;
      const result = courseRepo.deleteById(deleteId);
      expect(result).to.be.an.instanceOf(Course);
      expect(result.title).to.be.equal('Course to Delete');
    });

    it('should remove the course from the datastore/database', () => {
      const deleteId = courseRepo.newCourse('Course to Delete').id;
      expect(courseRepo.getById(deleteId)).to.be.an.instanceOf(Course);
      courseRepo.deleteById(deleteId);
      expect(courseRepo.getById(deleteId)).to.not.be.ok;
    });

    it('should throw an error if the id is not valid', () => {
      expect(() => courseRepo.deleteById()).to.throw('Delete requires a valid id');
      expect(() => courseRepo.deleteById('foo')).to.throw('Delete requires a valid id');
      expect(() => courseRepo.deleteById({ id: 10 })).to.throw('Delete requires a valid id');
      expect(() => courseRepo.deleteById({})).to.throw('Delete requires a valid id');
      expect(() => courseRepo.deleteById(false)).to.throw('Delete requires a valid id');
      expect(() => courseRepo.deleteById(undefined)).to.throw('Delete requires a valid id');
    });
    
    it('should return falsy if a course with id does not exist', () => {
      let result = courseRepo.deleteById(-1);
      expect(result).to.not.be.ok;
      result = courseRepo.deleteById(9999999999);
      expect(result).to.not.be.ok;
    });
  });
});
