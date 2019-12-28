class TaskDAO {
    constructor() {
        this.tasks = [];
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
}