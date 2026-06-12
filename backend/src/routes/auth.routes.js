const { Router } = require('express');
const { register, login } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../utils/schemas/auth.schema');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar usuario
 *     tags: [Auth]
 *     security: []
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
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: "f63780b0-544f-437d-8207-cd25af16f5dc"
 *                 name: "Juan Pérez"
 *                 email: "juan@mail.com"
 *                 role: "USER"
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El email ya está registrado
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 token: "jwt.token.here"
 *                 user:
 *                   id: "f63780b0-544f-437d-8207-cd25af16f5dc"
 *                   name: "Juan Pérez"
 *                   email: "juan@mail.com"
 *                   role: "USER"
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validate(loginSchema), login);

module.exports = router;
