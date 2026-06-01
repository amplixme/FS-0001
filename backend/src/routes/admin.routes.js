const { Router } = require('express');

const router = Router();

const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

module.exports = router;