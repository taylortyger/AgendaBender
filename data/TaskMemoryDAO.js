const Task = require('./Task');

// meant to be private helper-methods
const matchesCriteria = (task, criteria) => Object.keys(criteria).reduce((matching, key) => {
  if (matching) return criteria[key] === task[key];
  return false;
}, true);

const validateNewTaskProps = (props) => (props && props.title && props.course);

const validateUpdateTaskProps = (props) => (props && props.id);

// In-memory implementation
class TaskMemoryDAO {
  constructor() {
    this.tasks = [];
    this.maxId = 0;
  }

  find(criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      return this.tasks;
    }
    return this.tasks.filter((task) => matchesCriteria(task, criteria));
  }

  findById(id) {
    return this.tasks.find((task) => task.id === id) || null;
  }

  newTask(props) {
    if (!validateNewTaskProps(props)) return null;
    this.maxId += 1;
    const task = new Task(
      this.maxId,
      props.title,
      props.course,
      props.deadline,
      props.completed,
      props.scheduledDate,
    );
    this.tasks.push(task);
    return task;
  }

  updateTask(props) {
    if (!validateUpdateTaskProps(props)) return null;
    const task = this.findById(props.id);
    return task && Object.assign(task, {
      ...props.title && { title: props.title },
      ...props.course && { course: props.course },
      ...props.deadline && { deadline: props.deadline },
      ...props.completed && { completed: props.completed },
      ...props.scheduledDate && { scheduledDate: props.scheduledDate },
    });
  }

  // might be better to just have a deleted flag?
  deleteById(id) {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex >= 0) {
      return this.tasks.splice(taskIndex, 1)[0] || null;
    }
    return null;
  }
}

module.exports = TaskMemoryDAO;
