const { Router } = require('express');
const router = Router();

const {
  getAll,
  create,
  update,
  remove,
} = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: "cat-1"
 *                   name: "Tecnología"
 *                   slug: "tecnologia"
 *
 *   post:
 *     summary: Crear categoría
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tecnología"
 *     responses:
 *       201:
 *         description: Categoría creada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores
 *       409:
 *         description: La categoría ya existe
 */
router.get('/', getAll);
router.post('/', authMiddleware, requireRole('ADMIN'), create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar categoría
 *     tags: [Categories]
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
 *                 example: "Programación"
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores
 *       404:
 *         description: Categoría no encontrada
 *
 *   delete:
 *     summary: Eliminar categoría
 *     tags: [Categories]
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
 *         description: Categoría eliminada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/:id', authMiddleware, requireRole('ADMIN'), update);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), remove);

module.exports = router;
