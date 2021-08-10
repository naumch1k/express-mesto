const jwt = require('jsonwebtoken');

const { NotFoundError } = require('../errors/index');
const StatusMessages = require('../utils/status-messages');
const { JWT_SECRET } = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new NotFoundError(StatusMessages.UNAUTHORIZED);
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new NotFoundError(StatusMessages.UNAUTHORIZED);
  }

  req.user = payload;

  next();
};
