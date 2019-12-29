const Task = require('./Task');
// In-memory implementation
class TaskDAO {
    constructor() {
        this.tasks = [];
        this.maxID = 0;
    }

    find(criteria) {
        if(Object.keys(criteria).length === 0) return this.tasks;
        else {
            return this.tasks.filter(task => this.matchesCriteria(task, criteria));
        }
    }

    findById(id) {
        return this.tasks.filter(task => task.id == id);
    }

    newTask(props) {
        if(!this.validateNewTaskProps(props)) return;
        let taskID = ++this.maxID;
        let task = new Task(taskID, props.title, props.course, props.deadline, props.completed, props.scheduledDate);
        this.tasks.push(task);
        return task;
    }

    updateTask(props) {
        if(!this.validateUpdateTaskProps(props)) return;
        let task = this.findById(props.id)[0];
        if(task) {
            task.title = props.title || task.title;
            task.course = props.course || task.course;
            task.deadline = props.deadline || task.deadline;
            task.completed = props.completed || task.completed;
            task.scheduledDate = props.scheduledDate || task.scheduledDate; 
        }
        return task;
    }

    // might be better to just have a delete flag?
    deleteByID(id) {
        let task = this.findById(id);
        this.tasks = this.tasks.filter((task) => task.id != id);
        return task;
    }

    //meant to be private
    matchesCriteria(task, criteria) {
        let matches = true;
        for(key in criteria) {
            if (criteria[key] != task[key]){
                matches = false;
            }
        }
        return matches;
    }
    
    validateNewTaskProps(props) {
        if(!props.title || !props.course) return false;
        return true;
    }
    
    validateUpdateTaskProps(props) {
        if(!props.id) return false;
        return true;
    }
}

module.exports = TaskDAO;