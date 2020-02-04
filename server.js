const express = require('express');
// eslint-disable-next-line prefer-destructuring
const argv = require('yargs').argv;
const taskRouter = require('./routes/task');
const courseRouter = require('./routes/course');
const seed = require('./dev/seed');

const app = express();

app.use('/api/task', taskRouter);
app.use('/api/course', courseRouter);

if (process.env.NODE_ENV === 'development' && argv.seed) {
  console.log('seeding database...');
  seed(argv.taskCount, argv.courseCount);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
