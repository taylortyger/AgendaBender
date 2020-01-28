const seed = (repo, taskCount, courseCount) => {
  const numberOfTasks = taskCount || 10;
  const numberOfCourses = courseCount || 4;
  let courseId = 1;
  for (let taskSuffix = 1; taskSuffix <= numberOfTasks; taskSuffix += 1) {
    repo.newTask({ title: `Test Task ${taskSuffix}`, courseId });
    courseId += 1;
    if (courseId > numberOfCourses) {
      courseId = 1;
    }
  }
};

module.exports = seed;
