const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const { upload } = require('../controllers/upload.controller');

const router = Router();

router.post('/', authMiddleware, uploadMiddleware.single('image'), upload);

module.exports = router;
