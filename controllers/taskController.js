const TaskRepository = require('../data/TaskRepository');
const TaskDAO = require('../data/TaskDAO');

const taskRepo = new TaskRepository(new TaskDAO);

const getAll = (req, res) => {
    res.send(taskRepo.getAll());
};

const getByID = (req, res) => {
    const task = taskRepo.getByID(parseInt(req.params.id));
    if(task) {
        res.send(task);
    } else {
        res.status(404).send("The task with the given id was not found.");
    }
};

const create = (req, res) => {
    res.json(taskRepo.newTask({
                title: req.body.title,
                course: req.body.course,
                deadline: req.body.deadline
            })
    );
};

const updateByID = (req, res) => {
    const props = {
        id: parseInt(req.params.id),
        title: req.body.title,
        course: req.body.course,
        deadline: req.body.deadline,
        completed: req.body.completed,
        scheduledDate: req.body.scheduledDate
    }
    const task = taskRepo.update(props);
    if(task) {
        res.send(task);
    } else {
        res.status(404).send("The task with the given id was not found.");
    }
};

const deleteByID = (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if(taskIndex) {
        removedTask = tasks.splice(taskIndex, 1);
        res.send(removedTask);
    } else {
        res.status(404).send("The task with the given id was not found.");
    }
};

module.exports = {
    getAll: getAll,
    getByID: getByID,
    create: create,
    updateByID: updateByID,
    deleteByID: deleteByID
};