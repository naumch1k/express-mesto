const jwt = require('jsonwebtoken');

const StatusCodes = require('../utils/status-codes');
const StatusMessages = require('../utils/status-messages');

// const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: StatusMessages.UNAUTHORIZED });
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: StatusMessages.UNAUTHORIZED });
  }

  req.user = payload;

  next();
};
