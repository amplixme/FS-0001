const { Router } = require('express');
const router = Router({ mergeParams: true });

const { create } = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createCommentSchema } = require('../utils/schemas/comment.schema');

router.post('/', authMiddleware, validate(createCommentSchema), create);

module.exports = router;