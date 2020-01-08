const seed = (repo, n) => {
  const numberOfTasks = n || 10;
  for (let i = 1; i <= numberOfTasks; i += 1) {
    repo.newTask({ title: `Test Task ${i}`, course: 'TEST COURSE' });
  }
};

module.exports = seed;
