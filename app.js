const express = require('express');
const mongoose = require('mongoose');

const StatusCodes = require('./utils/utils');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use((req, res, next) => {
  req.user = {
    _id: '60fdc5f6239b724e23e03d80',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
