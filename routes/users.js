const router = require('express').Router();
const auth = require('../middlewares/auth');
const { returnsUser, returnsAllUsers, updateUser, updateAvatar } = require('../controllers/user');


router.get('/', auth, returnsAllUsers);
router.get('/:id', auth, returnsUser);
router.patch('/me', auth, updateUser);
router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;