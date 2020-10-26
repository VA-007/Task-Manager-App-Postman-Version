const bcrypt = require('bcryptjs')

const hashingPasswords = async () => {
  const password = 'Hello321@';
  const hashedPassword = await bcrypt.hash(password, 8);
  
  console.log(password);
  console.log(hashedPassword);

  const isMatch = await bcrypt.compare('Hello321@', hashedPassword);
  console.log(isMatch);
}

hashingPasswords();