class Task {
  constructor(id, title, courseId, deadline = null, completed = false, scheduledDate = null) {
    this.id = id;
    this.title = title;
    this.courseId = courseId;
    this.deadline = deadline;
    this.completed = completed;
    this.scheduledDate = scheduledDate;
  }
}

module.exports = Task;
