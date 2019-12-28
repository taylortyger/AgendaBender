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
        if(!validateTaskProps(props)) return;
        taskID = this.maxID++;
        this.tasks.push(new Task(taskID, ...props));
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
    
    validateTaskProps(props) {
        if(!props.title || !props.course) return false;
        return true;
    }
}