const { Router } = require('express');

const router = Router();

const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

const { stats } = require('../controllers/admin.controller');

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/stats', stats);

module.exports = router;