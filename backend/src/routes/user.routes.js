const { Router } = require('express');
const router = Router();

const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileSchema } = require('../utils/schemas/user.schema');
const { getProfile, updateProfile } = require('../controllers/user.controller');

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               bio:
 *                 type: string
 *                 example: "Desarrollador Full Stack"
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: "f63780b0-544f-437d-8207-cd25af16f5dc"
 *                 name: "Juan Pérez"
 *                 bio: "Desarrollador Full Stack"
 *                 avatarUrl: "https://example.com/avatar.jpg"
 *                 role: "USER"
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/me', authMiddleware, validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener perfil público de un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: "f63780b0-544f-437d-8207-cd25af16f5dc"
 *                 name: "Juan Pérez"
 *                 bio: "Desarrollador Full Stack"
 *                 avatarUrl: "https://example.com/avatar.jpg"
 *                 postsCount: 12
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', getProfile);

module.exports = router;
