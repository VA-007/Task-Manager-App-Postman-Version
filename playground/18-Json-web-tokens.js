const jwt = require('jsonwebtoken')

const webTokens = async () => {
  const token = jwt.sign({ _id: 'Hello123' }, 'secretKey', { expiresIn: '10 seconds' });
  console.log(token);

  const data = jwt.verify(token, 'secretKey');
  console.log(data);
}

webTokens();