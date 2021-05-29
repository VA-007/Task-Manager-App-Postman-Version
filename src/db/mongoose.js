const mongoose = require('mongoose')

// --> Connecting to the mongoose client database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false         // Bypassing the deprication warning in this method by setting this to false
});
