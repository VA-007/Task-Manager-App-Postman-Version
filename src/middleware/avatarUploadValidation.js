const multer = require('multer')

// --> Setting up multer Middleware for upload validation like file type,size and setting up the destination of the files.
upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {          // Using Regular Expressions(RegEx) here
      return cb(new Error('Please upload a valid image file. Supported extensions are jpg,jpeg and png.'));
    }

    return cb(undefined, true);
  }
});

module.exports = upload;