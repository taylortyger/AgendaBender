const Course = require('./Course');
const InMemoryDataStore = require('./InMemoryDataStore');

const validateTitle = (title) => (title && typeof title === 'string');
const validateUpdateCourseProps = (props) => (props && Number.isInteger(props.id));
const validateDeleteId = (id) => Number.isInteger(id);

const matchesCriteria = (course, criteria) => Object.keys(criteria).reduce((matching, key) => {
  if (matching) return criteria[key] === course[key];
  return false;
}, true);

class CourseMemoryDAO {
  constructor() {
    this.data = InMemoryDataStore;
  }

  newCourse(title) {
    if (!validateTitle(title)) throw new Error('Courses must have a valid title');
    this.data.maxCourseId += 1;
    const course = new Course(this.data.maxCourseId, title);
    this.data.courses.push(course);
    return course;
  }

  find(criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      return this.data.courses;
    }
    return this.data.courses.filter((course) => matchesCriteria(course, criteria));
  }

  findById(id) {
    return this.data.courses.find((course) => course.id === id);
  }

  updateCourse(props) {
    if (!validateUpdateCourseProps(props)) throw new Error('Updating requires a valid course id');
    const course = this.findById(props.id);
    return course && Object.assign(course, {
      ...props.title && { title: props.title },
    });
  }

  deleteById(id) {
    if (!validateDeleteId(id)) throw new Error('Delete requires a valid id');
    const courseIndex = this.data.courses.findIndex((t) => t.id === id);
    if (courseIndex >= 0) {
      return this.data.courses.splice(courseIndex, 1)[0];
    }
    return undefined;
  }
}

module.exports = CourseMemoryDAO;
