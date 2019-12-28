class TaskRepository {
    constructor(dao){
        this.dao = dao;
    }

    getAll() {
        return this.dao.find({});
    }

    getByID(id) {
        return this.dao.findById(id);
    }

    update(props) {
        return this.dao.update(props);
    }

    getByCourse(course) {
        return this.dao.find({}).filter((task) => task.course === course);
    }

    newTask(props) {
        return this.dao.newTask(props);
    }

}