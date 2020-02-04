function dataStore() {
  const that = {
    tasks: [],
    courses: [],
    maxCourseId: 0,
    maxTaskId: 0,
  };
  that.clear = () => {
    that.tasks = [];
    that.courses = [];
    that.maxCourseId = 0;
    that.maxTaskId = 0;
  };
  return that;
}


module.exports = dataStore();
