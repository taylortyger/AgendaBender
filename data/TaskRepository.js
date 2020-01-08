class TaskRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll() {
    return this.dao.find({});
  }

  getById(id) {
    return this.dao.findById(id);
  }

  update(props) {
    return this.dao.updateTask(props);
  }

  getByCourse(course) {
    return this.dao.find({}).filter((task) => task.course === course);
  }

  newTask(props) {
    return this.dao.newTask(props);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}

module.exports = TaskRepository;
