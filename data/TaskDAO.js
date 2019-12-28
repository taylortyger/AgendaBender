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
        if(!validateNewTaskProps(props)) return;
        taskID = this.maxID++;
        task = new Task(taskID, ...props);
        this.tasks.push(task);
        return task;
    }

    updateTask(props) {
        if(!validateUpdateTaskProps(props)) return;
        task = this.findById(props.id);
        if(task) {
            Object.assign(task, props);
        }
        return task;
    }

    //meant to be private
    matchesCriteria(task, criteria) {
        matches = true;
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