const Course = require('./Course');

const validateTitle = (title) => (title && (typeof title === 'string' || title instanceof String));

const matchesCriteria = (course, criteria) => Object.keys(criteria).reduce((matching, key) => {
  if (matching) return criteria[key] === course[key];
  return false;
}, true);

class CourseMemoryDAO {
  constructor() {
    this.courses = [];
    this.maxCourseId = 0;
  }

  newCourse(title) {
    if (!validateTitle(title)) return undefined;
    this.maxCourseId += 1;
    const course = new Course(this.maxCourseId, title);
    this.courses.push(course);
    return course;
  }

  find(criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      return this.courses;
    }
    return this.courses.filter((course) => matchesCriteria(course, criteria));
  }

  findById(id) {
    return this.courses.find((course) => course.id === id);
  }
}

module.exports = CourseMemoryDAO;
