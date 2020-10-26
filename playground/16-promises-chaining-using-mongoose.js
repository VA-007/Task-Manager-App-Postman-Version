require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findOneAndUpdate('5f626aa197d844238cb7a35b', { age: 7 }).then((user) => {
//   console.log(user);

//   return User.countDocuments({ age: 6 })
// }).then((users) => {
//   if (!users) {
//     return console.log(`No matching user with the given data`);
//   }

//   console.log(users);
// }).catch((e) => {
//   console.log(e);
// });


// --> Using Async/Await
// const findUpdateAndCount = async (id, age) => {
//   const user = await User.findByIdAndUpdate(id, {age: 19});
//   const count = await User.countDocuments({ age });
//   return count;
// }

// findUpdateAndCount('5f626aa197d844238cb7a35b', 7).then((count) => {
//   console.log(count);
// }).catch((e) => {
//   console.log(e);
// });




// <<<<<<<<==========----------==========----------==========----------==========----------==========----------==========>>>>>


require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5f626aa597d844238cb7a55d').then((task) => {
//   console.log('The following task has been deleted successfully -', task);

//   return Task.countDocuments({ completed: false })
// }).then((tasks) => {
//   if (!tasks) {
//     return console.log('All Tasks are completed!');
//   }

//   console.log(tasks);
// }).catch((e) => {
//   console.log(e);
// });

// --> Using Async/Await
const findOneDeleteAndCount = async (id, parameter) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments(parameter);
  return count;
}

findOneDeleteAndCount('5f626aa597d844238cb7a39d', { completed: false }).then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
});