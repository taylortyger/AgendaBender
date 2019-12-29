class Task {
    constructor(id, title, course, deadline = null, completed = false, scheduledDate = null) {
        this.id = id;
        this.title = title;
        this.course = course;
        this.deadline = deadline;
        this.completed = completed;
        this.scheduledDate = scheduledDate;
    }

    schedule(date) {
        // schedule this task for the given date
    }

    complete() {
        this.completed = true;
    }

    uncomplete() {
        this.completed = false;
    }

    rename(title) {
        this.title = title;
    }
}

module.exports = Task;