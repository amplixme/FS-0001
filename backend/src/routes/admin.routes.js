const { Router } = require('express');

const router = Router();

const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

const { stats, users, createUser, changeRole } = require('../controllers/admin.controller');

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/stats', stats);
router.get('/users', users);
router.post('/users', createUser);
router.patch('/users/:id/role', changeRole);

module.exports = router;