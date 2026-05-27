const { Router } = require('express');
const router = Router({ mergeParams: true });

const { create, getByPost } = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createCommentSchema } = require('../utils/schemas/comment.schema');

router.get('/', getByPost);
router.post('/', authMiddleware, validate(createCommentSchema), create);

module.exports = router;