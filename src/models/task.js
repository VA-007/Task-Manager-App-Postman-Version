const mongoose = require('mongoose')

// --> Creating a new mongoose Schema for tasks to add support for the timestamp feature
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

// --> Creating a new mongoose model named Task
const Task = mongoose.model('Task', taskSchema);

// --> Exporting the Task
module.exports = Task;





// // =========================== EXAMPLE CODE START =========================== 
// // --> Creating a document for insertion in the new mongoose model
// const work = new Task({
//   description: '  Clean the room    '
// });

// // --> Saving the document after insertion
// work.save().then((response) => {
//   console.log(response);
// }).catch((error) => {
//   console.log('Error: ', error);
// });
// // ============================ EXAMPLE CODE END ============================ 
