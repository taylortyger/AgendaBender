const Task = require('./Task');
const InMemoryDataStore = require('./InMemoryDataStore');

// meant to be private helper-methods
const matchesCriteria = (task, criteria) => Object.keys(criteria).reduce((matching, key) => {
  if (matching) return criteria[key] === task[key];
  return false;
}, true);

const validateNewTaskProps = (props = {}) => (props
                                              && props.title
                                              && Number.isInteger(props.courseId));
const validateUpdateTaskProps = (props = {}) => (props && props.id);

// In-memory implementation
class TaskMemoryDAO {
  constructor() {
    this.data = InMemoryDataStore;
  }

  find(criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      return this.data.tasks;
    }
    return this.data.tasks.filter((task) => matchesCriteria(task, criteria));
  }

  findById(id) {
    return this.data.tasks.find((task) => task.id === id);
  }

  newTask(props) {
    if (!validateNewTaskProps(props)) return undefined;
    this.data.maxTaskId += 1;
    const task = new Task(
      this.data.maxTaskId,
      props.title,
      props.courseId,
      props.deadline,
      props.completed,
      props.scheduledDate,
    );
    this.data.tasks.push(task);
    return task;
  }

  updateTask(props) {
    if (!validateUpdateTaskProps(props)) return undefined;
    const task = this.findById(props.id);
    return task && Object.assign(task, {
      ...props.title && { title: props.title },
      ...props.courseId && { courseId: props.courseId },
      ...props.deadline && { deadline: props.deadline },
      ...props.completed && { completed: props.completed },
      ...props.scheduledDate && { scheduledDate: props.scheduledDate },
    });
  }

  // might be better to just have a deleted flag?
  deleteById(id) {
    const taskIndex = this.data.tasks.findIndex((t) => t.id === id);
    if (taskIndex >= 0) {
      return this.data.tasks.splice(taskIndex, 1)[0];
    }
    return undefined;
  }
}

module.exports = TaskMemoryDAO;
