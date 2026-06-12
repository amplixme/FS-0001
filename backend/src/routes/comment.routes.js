const { Router } = require('express');
const router = Router({ mergeParams: true });
const {
  create,
  getByPost,
  update,
  remove,
} = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createCommentSchema,
  updateCommentSchema,
} = require('../utils/schemas/comment.schema');

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Obtener comentarios de un post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: "comment-1"
 *                   content: "Excelente artículo"
 *                   createdAt: "2026-06-01T12:00:00.000Z"
 *                   author:
 *                     id: "user-1"
 *                     name: "Juan Pérez"
 *
 *   post:
 *     summary: Crear comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Muy buen post"
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.get('/', getByPost);
router.post('/', authMiddleware, validate(createCommentSchema), create);

/**
 * @swagger
 * /api/posts/{postId}/comments/{id}:
 *   put:
 *     summary: Actualizar comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
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
 *               content:
 *                 type: string
 *                 example: "Comentario actualizado"
 *     responses:
 *       200:
 *         description: Comentario actualizado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No eres el autor
 *       404:
 *         description: Comentario no encontrado
 *
 *   delete:
 *     summary: Eliminar comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No eres el autor
 *       404:
 *         description: Comentario no encontrado
 */
router.put('/:id', authMiddleware, validate(updateCommentSchema), update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
