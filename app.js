require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const StatusCodes = require('./utils/status-codes');
const StatusMessages = require('./utils/status-messages');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res, next) => {
  const { statusCode = StatusCodes.DEFAULT, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === StatusCodes.DEFAULT ? StatusMessages.DEFAULT : message,
    });

  next();
});

app.listen(PORT);
