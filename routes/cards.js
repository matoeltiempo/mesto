const router = require('express').Router();
const auth = require('../middlewares/auth');
const { returnsCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/card');

router.get('/', auth, returnsCards);
router.post('/', auth, createCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, likeCard);
router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;