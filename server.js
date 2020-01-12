const express = require('express');
const taskRouter = require('./routes/task');

const app = express();

app.use('/api/task', taskRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
