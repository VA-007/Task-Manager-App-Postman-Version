const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// --> Loading in Express and setting up the port
const app = express();
const port = process.env.PORT || 3000;

// --> Confugring Express to automatically parse the incoming JSON data for us. It can be used using req.body in our handlers.
app.use(express.json());

// --> Setting up the separate router files for user and task for use here
app.use(userRouter);
app.use(taskRouter);

// --> Starting the Server locally
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
