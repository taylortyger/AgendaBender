const seed = (repo, taskCount, courseCount) => {
  const numberOfTasks = taskCount || 10;
  const numberOfCourses = courseCount || 4;
  let courseSuffix = 1;
  for (let taskSuffix = 1; taskSuffix <= numberOfTasks; taskSuffix += 1) {
    repo.newTask({ title: `Test Task ${taskSuffix}`, course: `TEST COURSE ${courseSuffix}` });
    courseSuffix += 1;
    if (courseSuffix > numberOfCourses) {
      courseSuffix = 1;
    }
  }
};

module.exports = seed;
