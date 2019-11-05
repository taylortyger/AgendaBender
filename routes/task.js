const express = require('express');
const router = express.Router();

router.use(express.json());

const tasks = [
    {
        id: 1, 
        title: "Midterm Exam", 
        course: "CS5800",
        deadline: "Tuesday 11/05/2019 9:00:00"
    },
    {
        id: 2, 
        title: "Assignment 5", 
        course: "CS5050",
        deadline: "Friday 11/08/2019 8:30:00"
    },
    {
        id: 3, 
        title: "Chapter 9", 
        course: "MSLE3310",
        deadline: "Thursday 11/07/2019 23:59:00"
    }
];

// read
router.get('/', (req, res) => {
    res.send(tasks);
});

router.get('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if(task) {
        res.send(task);
    } else {
        res.status(404).send("The task wtih the given id was not found.");
    }
});

// create
router.post('/', (req, res) => {
    const title = req.body.title;
    const course = req.body.course;
    const deadline = req.body.deadline;
    let task = {
        id: tasks.length,
        title: title,
        course: course,
        deadline: deadline
    }
    tasks.push(task);
    res.json(task);
});

//update
router.post('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    const title = req.body.title;
    const course = req.body.course;
    const deadline = req.body.deadline;
    if(task) {
        if(title) task.title = title;
        if(course) task.course = course;
        if(deadline) task.deadline = deadline;
        res.send(task);
    } else {
        res.status(404).send("The task wtih the given id was not found.");
    }
});

//delete
router.delete('/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if(taskIndex) {
        removedTask = tasks.splice(taskIndex, 1);
        res.send(removedTask);
    } else {
        res.status(404).send("The task wtih the given id was not found.");
    }
});

module.exports = router;