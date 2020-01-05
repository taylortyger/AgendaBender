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
        return this.dao.updateTask(props);
    }

    getByCourse(course) {
        return this.dao.find({}).filter((task) => task.course === course);
    }

    newTask(props) {
        let task = this.dao.newTask(props);
        console.log(task);
        return task;
    }

    deleteByID(id) {
        return this.dao.deleteByID(id);
    }
}

module.exports = TaskRepository;
