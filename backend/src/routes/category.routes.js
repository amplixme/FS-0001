const { Router } = require('express');
const router = Router();

const {
  getAll,
  create,
  update,
  remove,
} = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/', getAll);
router.post('/', authMiddleware, requireRole('ADMIN'), create);
router.put('/:id', authMiddleware, requireRole('ADMIN'), update);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), remove);

module.exports = router;
