const Card = require('../models/card');
const StatusCodes = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(StatusCodes.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки: ${err}` });
        return;
      }
      res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Не по-пацански это - удалять чужие карточки' });
      } else {
        Card.deleteOne(card)
          .then(() => res.status(StatusCodes.OK).send({ message: 'Карточка успешно удалена' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Невалидный id' });
        return;
      }
      res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Невалидный id' });
        return;
      }
      res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Невалидный id' });
        return;
      }
      res.status(StatusCodes.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};
