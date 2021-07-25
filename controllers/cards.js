const Card = require('../models/card');

const ErrorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  DEFAULT: 500,
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ErrorCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки: ${err}` });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(ErrorCodes.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(ErrorCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(ErrorCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(ErrorCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};
