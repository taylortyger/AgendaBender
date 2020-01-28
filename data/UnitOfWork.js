const validateTaskTitle = (title) => (title && (typeof title === 'string' || title instanceof String));
const validateCourseId = (id) => (id && Number.isInteger(id));

class UnitOfWork {
  constructor(taskRepo, courseRepo) {
    this.taskRepo = taskRepo;
    this.courseRepo = courseRepo;
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
