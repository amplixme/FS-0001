const { Router } = require('express');
const router = Router({ mergeParams: true });
const { create, getByPost, update, remove } = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createCommentSchema, updateCommentSchema } = require('../utils/schemas/comment.schema');

router.get('/', getByPost);
router.post('/', authMiddleware, validate(createCommentSchema), create);
router.put('/:id', authMiddleware, validate(updateCommentSchema), update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;