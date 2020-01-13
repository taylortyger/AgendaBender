const Course = require('./Course');

class CourseMemoryDAO {
  constructor() {
    this.courses = [];
    this.maxCourseId = 0;
  }
}

module.exports = CourseMemoryDAO;
