const { Router } = require('express');
const router = Router();

const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createPostSchema,
  updatePostSchema,
} = require('../utils/schemas/post.schema');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Gestión de publicaciones
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crear un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mi primer post
 *               content:
 *                 type: string
 *                 example: Contenido del artículo...
 *               published:
 *                 type: boolean
 *                 example: true
 *               coverImage:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       200:
 *         description: Post creado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/', authMiddleware, validate(createPostSchema), create);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtener listado de posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: javascript
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *         example: tecnologia
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, comments]
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado
 *       404:
 *         description: Post no encontrado
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Actualizar un post
 *     tags: [Posts]
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               published:
 *                 type: boolean
 *               coverImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post actualizado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No eres el autor del post
 *       404:
 *         description: Post no encontrado
 */
router.put('/:id', authMiddleware, validate(updatePostSchema), update);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Eliminar un post
 *     tags: [Posts]
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
 *         description: Post eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No eres el autor del post
 *       404:
 *         description: Post no encontrado
 */
router.delete('/:id', authMiddleware, remove);

module.exports = router;
