const jwt = require('jsonwebtoken');

const StatusCodes = require('../utils/utils');
// const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(StatusCodes.FORBIDDEN).send({ message: 'Необходима авторизация' });
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(StatusCodes.FORBIDDEN).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
