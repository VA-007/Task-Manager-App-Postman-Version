const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const upload = require('../middleware/avatarUploadValidation')
const router = express.Router()
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account')


// --> Creating the Endpoints
router.post('/users', async (req, res) => {          // Resource creation/Signup endpoint for user
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);          // Invoking sendWelcomeEmail() to send the welcome Email
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }

  // Old code using Promises
  // user.save().then(() => {
  //   res.status(201).send(user);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });
});

router.post('/users/login', async (req, res) => {          // Login endpoint for user
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: 'Unable to login :(' });
  }
});

router.post('/users/logout', auth, async (req, res) => {          // Logout endpoint for user
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {          // Logout from all sessions endpoint for user
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {          // Resource reading endpoint for my profile
  res.send(req.user);

  // Old code using Promises to read all users
  // User.find({}).then((users) => {
  //   res.send(users);
  // }).catch(() => {
  //   res.status(500).send();
  // });
});

router.patch('/users/me', auth, async (req, res) => {          // Resource Updation Endpoint for a user
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));       // Using arrow function shorthand  

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Cant update invalid parameter' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);

    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/users/me', auth, async (req, res) => {          // Resource deletion endpoint for user
  try {
    // // Old code for fetching and deleting user by id
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(400).send();
    // }

    await req.user.remove();
    sendGoodbyeEmail(req.user.email, req.user.name);          // Invoking sendGoodbyeEmail() to send the Goodbye Email
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {  // Resource uploading endpoint for uploding profile pics.
  const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer();  // Using sharp to resize image
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message, reason: 'Supported file size below 1Mb' });
});

router.delete('/users/me/avatar', auth, async (req, res) => {       // Resource deletion endpoint for deleting profile pics.
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get('/users/:id/avatar', async (req, res) => {        // Resource reading endpoint for reading and serving profile pics.            
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;