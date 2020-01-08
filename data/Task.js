class Task {
  constructor(id, title, course, deadline = null, completed = false, scheduledDate = null) {
    this.id = id;
    this.title = title;
    this.course = course;
    this.deadline = deadline;
    this.completed = completed;
    this.scheduledDate = scheduledDate;
  }
}

module.exports = Task;
