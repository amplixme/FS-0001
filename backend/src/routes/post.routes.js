const { Router } = require('express');
const router = Router();

const { create } = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createPostSchema } = require('../utils/schemas/post.schema');

router.post('/', authMiddleware, validate(createPostSchema), create);

module.exports = router;