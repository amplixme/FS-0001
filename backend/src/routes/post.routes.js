const { Router } = require('express');
const router = Router();

const { create, getAll, getById, update, remove } = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createPostSchema, updatePostSchema } = require('../utils/schemas/post.schema');

router.post('/', authMiddleware, validate(createPostSchema), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', authMiddleware, validate(updatePostSchema), update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;