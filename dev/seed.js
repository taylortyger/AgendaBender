const UnitOfWork = require('../data/UnitOfWork');

const unitOfWork = new UnitOfWork();

const seed = (taskCount, courseCount) => {
  const numberOfTasks = taskCount || 10;
  const numberOfCourses = courseCount || 4;
  const courseIds = [];
  for (let i = 1; i <= numberOfCourses; i += 1) {
    courseIds.push(unitOfWork.courseRepo.newCourse(`Course ${i}`).id);
  }
  let courseIdsIndex = 0;
  for (let taskSuffix = 1; taskSuffix <= numberOfTasks; taskSuffix += 1) {
    unitOfWork.createTask(`Test Task ${taskSuffix}`, courseIds[courseIdsIndex]);
    courseIdsIndex += 1;
    if (courseIdsIndex > courseIds.length - 1) {
      courseIdsIndex = 0;
    }
  }
};

module.exports = seed;
