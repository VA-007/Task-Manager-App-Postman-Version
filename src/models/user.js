const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Task = require('./task')

// --> Creating a new mongoose Schema for User to hash passwords before saving the user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age cannot be negative!');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

// --> Creating a virtual relationship for linking task to the user without creating a saperate method for it above.
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

// --> Securing the data by deleting the user password and the tokens array while showing user publically.
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
}

// --> Defining a method called generateAuthToken() which generates authentication token for a particular user hence we are using .methods
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);     // process.env.JWT_SECRET is the secret key in dev.env file

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

// --> Defining method called findByCredentials() to perform the login operation by comparing email and passwords
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login :(');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login :(');
  }

  return user;
}

// --> Initiating the mongoose middleware to run and Hash the plain text password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// --> Deleting the tasks of the deleted user using the mongoose middleware
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// --> Creating a new mongoose model named User
const User = mongoose.model('User', userSchema);

// --> Exporting the User
module.exports = User;




// // =========================== EXAMPLE CODE START =========================== 
// // --> Creating a document for insertion in the new mongoose model
// const me = new User({
//   name: '  Vishank        ',
//   email: 'hello@world.com   ',
//   password: 'Passwo'
// });

// // --> Saving the document after insertion
// me.save().then((response) => {
//   console.log(response);
// }).catch((error) => {
//   console.log(error);
// });
// // ============================ EXAMPLE CODE END ============================ 
