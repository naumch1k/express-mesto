const User = require('../models/user');
const StatusCodes = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch(() => res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(StatusCodes.CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя: ${err}` });
        return;
      }
      res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Невалидный id' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
        return;
      }
      res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Невалидный id' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении аватара: ${err}` });
        return;
      }
      res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};
