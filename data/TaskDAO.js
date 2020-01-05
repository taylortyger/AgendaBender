const Task = require('./Task');
// In-memory implementation
class TaskDAO {
    constructor() {
        this.tasks = [];
        this.maxID = 0;
    }

    find(criteria) {
        if(!criteria || Object.keys(criteria).length === 0) {
            return this.tasks;
        } else {
            return this.tasks.filter(task => this.matchesCriteria(task, criteria));
        }
    }

    findById(id) {
        return this.tasks.find(task => task.id == id);
    }

    newTask(props) {
        if(!this.validateNewTaskProps(props)) return;
        const taskID = ++this.maxID;
        const task = new Task(taskID, props.title, props.course, props.deadline, props.completed, props.scheduledDate);
        this.tasks.push(task);
        return task;
    }

    updateTask(props) {
        if(!this.validateUpdateTaskProps(props)) return;
        const task = this.findById(props.id);
        return Object.assign(task,{
                    ...props.title && { title: props.title },
                    ...props.course && { course: props.title },
                    ...props.deadline && { deadline: props.deadline },
                    ...props.completed && { completed: props.completed },
                    ...props.scheduledDate && { scheduledDate: props.scheduledDate }
                });
    }

    // might be better to just have a deleted flag?
    deleteByID(id) {
        let task = this.findById(id);
        this.tasks = this.tasks.filter((task) => task.id !== id);
        return task;
    }

    //meant to be private
    matchesCriteria(task, criteria) {
        for(key in criteria) {
            if (criteria[key] !== task[key]){
                return false;
            }
        }
        return true;
    }
    
    validateNewTaskProps(props) {
        return (props.title && props.course);
    }
    
    validateUpdateTaskProps(props) {
        return (props.id);
    }
}

module.exports = TaskDAO;
