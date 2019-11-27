const Card = require('../models/card');
const UnauthorizedError = require('../errors/unauthorized-error');
const ResOkError = require('../errors/succec-error');

module.exports.returnsCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((next));
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (owner === card.owner.toString()) {
        Card.findByIdAndRemove(cardId)
          .then(() => {
            throw new ResOkError('Удаление прошло успешно');
          }).catch(next);
      } throw new UnauthorizedError('Невозможно удалить карточку');
    }).catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((next));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((next));
};