const express = require('express');
const taskRouter = require('./routes/task');
const courseRouter = require('./routes/course');

const app = express();

app.use('/api/task', taskRouter);
app.use('/api/course', courseRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
