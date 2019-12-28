class TaskRepository {
    constructor(dao){
        this.dao = dao;
    }
    
    getAll(){
        this.dao.find({});
    }

}