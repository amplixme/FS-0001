const { Router } = require('express');
const router = Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { getProfile, updateProfile } = require('../controllers/user.controller');

router.put('/me', authMiddleware, updateProfile);
router.get('/:id', getProfile);

module.exports = router;