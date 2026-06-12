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

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Obtener estadísticas generales del sistema
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 totalUsers: 15
 *                 totalPosts: 42
 *                 totalComments: 128
 *                 postsByCategory:
 *                   - id: "cat-1"
 *                     name: "Tecnología"
 *                     count: 12
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores
 */
router.get('/stats', stats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Obtener listado de usuarios
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *
 *   post:
 *     summary: Crear usuario desde el panel de administración
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       409:
 *         description: Email ya registrado
 */
router.get('/users', users);
router.post('/users', createUser);

/**
 * @swagger
 * /api/admin/posts:
 *   get:
 *     summary: Obtener todos los posts para administración
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get('/posts', getPosts);

/**
 * @swagger
 * /api/admin/comments:
 *   get:
 *     summary: Obtener todos los comentarios para administración
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentarios
 */
router.get('/comments', getComments);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Alternar rol entre USER y ADMIN
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *       400:
 *         description: No puedes modificar tu propio rol
 *       404:
 *         description: Usuario no encontrado
 */
router.patch('/users/:id/role', changeRole);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Actualizar usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Email ya registrado
 *
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       400:
 *         description: No puedes eliminar tu propio usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.patch('/users/:id', update);
router.delete('/users/:id', removeUser);

/**
 * @swagger
 * /api/admin/posts/{id}:
 *   delete:
 *     summary: Eliminar cualquier post
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post eliminado correctamente
 *       404:
 *         description: Post no encontrado
 */
router.delete('/posts/:id', removePost);

/**
 * @swagger
 * /api/admin/comments/{id}:
 *   delete:
 *     summary: Eliminar cualquier comentario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentario eliminado correctamente
 *       404:
 *         description: Comentario no encontrado
 */
router.delete('/comments/:id', removeComment);

module.exports = router;
