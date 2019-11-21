
const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "8ade7bf0199a3179be4d31299e6a462c65e93b3f31f8a984e8e8a10ae7ef32ac");
  } catch (err) {
    return handleAuthError(res);
  } req.user = payload;
  next();
};