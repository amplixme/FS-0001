const { Router } = require('express');
const { register } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema } = require('../utils/schemas/auth.schema');

const router = Router();

router.post('/register', validate(registerSchema), register);

module.exports = router;
