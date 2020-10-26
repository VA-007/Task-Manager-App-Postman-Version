const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router();

// --> Creating the Endpoints
router.post('/tasks', auth, async (req, res) => {          // Resource creation endpoint for task
  const task = new Task({
    ...req.body,     // Using JavaScript ES6 spread operator
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }

  // Old code using Promises
  // task.save().then(() => {
  //   res.status(201).send(task) 
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });
});

// Filtering Data --> GET /tasks?completed=true/false
// Paginating Data --> GET /tasks?limit=2&page=1
// Sorting Data --> GET /tasks?sortBy=createdAt:asc/desc
router.get('/tasks', auth, async (req, res) => {          // Resource reading endpoint for tasks for a user
  // <-- Method 1 (Lengthy) -->
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = (req.query.completed === 'true');
  }

  if (req.query.sortBy) {                                                  // Adding the logic to execute sorting based on the provided query
    const parts = req.query.sortBy.split(':');      // Will split as ['createdAt', 'desc']
    sort[parts[0]] = (parts[1] === 'desc') ? -1 : 1;      // We cant write sort.createdAt as its not static and the user is providing the value
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,                                                               // Passing in the match if true or false
      options: {
        limit: parseInt(req.query.limit),                                  // Limiting the no. of tasks to show per page
        skip: parseInt(req.query.limit) * (parseInt(req.query.page) - 1),  // Page no. query to show data on the current page as limited above.
        sort
      }
    }).execPopulate();
    res.send(req.user.tasks);

    // // <-- Method 2 (Easy & Short) -->
    // const tasks = await Task.find({ owner: req.user._id, completed: (req.query.completed === 'true') });
    // res.send(tasks);
  } catch (e) {
    res.status(500).send()
  }
});

router.get('/tasks/:id', auth, async (req, res) => {          // Resource reading endpoint for a particular task
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
  // Old code using Promises
  // Task.findById(_id).then((task) => {
  //   if (!task) {
  //     return res.status(404).send();
  //   }

  //   res.send(task);
  // }).catch((e) => {
  //   res.status(500).send();
  // });
});

router.patch('/tasks/:id', auth, async (req, res) => {          // Resource Updation Endpoint for a task
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {          // Resource deletion endpoint for task
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;