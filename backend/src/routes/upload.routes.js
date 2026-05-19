import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { single } from '../middlewares/upload.middleware';
import { upload } from '../controllers/upload.controller';

const router = Router();

router.post(
  '/',
  authMiddleware,
  single('image'),
  upload,
);

export default router;