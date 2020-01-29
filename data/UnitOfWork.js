const TaskMemoryDAO = require('./TaskMemoryDAO');
const TaskRepository = require('./TaskRepository');
const CourseMemoryDAO = require('./CourseMemoryDAO');
const CourseRepository = require('./CourseRepository');

const validateTaskTitle = (title) => (title && (typeof title === 'string' || title instanceof String));
const validateCourseId = (id) => (id && Number.isInteger(id));

class UnitOfWork {
  constructor() {
    this.taskRepo = new TaskRepository(new TaskMemoryDAO());
    this.courseRepo = new CourseRepository(new CourseMemoryDAO());
  }

  createTask(title, courseId) {
    if (!validateTaskTitle(title) || !validateCourseId(courseId)) {
      throw new Error('A task must have a valid title and courseId');
    }
    const course = this.courseRepo.getById(courseId);
    if (!course) {
      throw new Error('A course with the given courseId does not exist');
    }
    return this.taskRepo.newTask({ title, courseId });
  }
}

module.exports = UnitOfWork;
