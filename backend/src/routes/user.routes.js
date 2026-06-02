const { Router } = require('express');
const router = Router();

const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileSchema } = require('../utils/schemas/user.schema');
const { getProfile, updateProfile } = require('../controllers/user.controller');

router.put('/me', authMiddleware, validate(updateProfileSchema), updateProfile);
router.get('/:id', getProfile);

module.exports = router;