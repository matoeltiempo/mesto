require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { errors, celebrate, Joi } = require('celebrate');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');

const cards = require('./routes/cards');
const users = require('./routes/users');

const { login, createUser } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);

app.use('/cards', cards);
app.use('/users', users);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().regex(
      /^(http:[\/][\/]|https:[\/][\/])(((\d{1,3}[\.]){3}\d{1,3}([:]\d{2,5})?)[\/]?|(w{3}[\.])?\w+([\.]\w+)?([^www][\.][a-zA-Z]{2,5})([\/]\w+)*(#)?[\/]?)/,
    ),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(errorLogger);
app.use(errors());

app.get('/:someRequest', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT);