const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { returnsUser, returnsAllUsers, updateUser, updateAvatar } = require('../controllers/user');

usersRouter.get('/', auth, returnsAllUsers);

usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).required(),
  }),
}), auth, returnsUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri(),
  }),
}), auth, updateUser);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), auth, updateAvatar);

module.exports = usersRouter;