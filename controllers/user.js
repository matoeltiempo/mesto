const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.returnsAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((next));
};

module.exports.returnsUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с таким id не найден`);
      } else res.send({ data: user });
    })
    .catch((next));
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Неверные данные пользователя');
      } return res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true,
      }).end();
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { name, about, avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => res.send({ data: user }))
    .catch(next);
};