class CourseRepository {
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
    return this.dao.updateCourse(props);
  }

  newCourse(title) {
    return this.dao.newCourse(title);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}

module.exports = CourseRepository;
