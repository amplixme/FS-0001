const { Router } = require('express');

const router = Router();

const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

const {
  stats,
  users,
  getPosts,
  getComments,
  createUser,
  changeRole,
  update,
  removeUser,
  removePost,
  removeComment,
} = require('../controllers/admin.controller');

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/stats', stats);
router.get('/users', users);
router.get('/posts', getPosts);
router.get('/comments', getComments);
router.post('/users', createUser);
router.patch('/users/:id/role', changeRole);
router.patch('/users/:id', update);
router.delete('/users/:id', removeUser);
router.delete('/posts/:id', removePost);
router.delete('/comments/:id', removeComment);

module.exports = router;
