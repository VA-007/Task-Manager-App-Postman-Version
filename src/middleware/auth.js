const jwt = require('jsonwebtoken')
const User = require('../models/user')

// --> Authorising a user for login by verifying the token and returning the user if found in the req.user object
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please Authenticate to continue...' });
  }
};

module.exports = auth;



// --> Note: The auth function will be added as a 2nd argument in the route handler functions in the user router ensuring it runs and authenticate the user before the route handler functions run.