const Course = require('./Course');

const validateTitle = (title) => (title && (typeof title === 'string' || title instanceof String));
const validateUpdateCourseProps = (props) => (props && props.id && Number.isInteger(props.id));

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
    if (!validateTitle(title)) throw new Error('Courses must have a valid title');
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

  updateCourse(props) {
    if (!validateUpdateCourseProps(props)) throw new Error('Updating requires a valid course id');
    const course = this.findById(props.id);
    return course && Object.assign(course, {
      ...props.title && { title: props.title },
    });
  }
}

module.exports = CourseMemoryDAO;
