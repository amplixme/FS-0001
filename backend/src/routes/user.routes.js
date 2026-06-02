const { Router } = require('express');
const router = Router();

const { getProfile } = require('../controllers/user.controller');
router.get('/:id', getProfile);

module.exports = router;