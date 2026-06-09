import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bcrypt = require('bcrypt');
const prisma = require('../config/prisma.js');
const { registerUser, loginUser } = require('../services/auth.service.js');

describe('auth.service', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('registerUser', () => {
    it('registra un usuario nuevo con éxito', async () => {
      const userData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      const createdUser = {
        id: 'user-1',
        name: userData.name,
        email: userData.email,
        password: 'hashed-password',
        role: 'USER',
      };

      vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      vi.spyOn(prisma.user, 'create').mockResolvedValue(createdUser);

      const result = await registerUser(userData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: userData.name,
          email: userData.email,
          role: 'USER',
        }),
      });

      const createCall = prisma.user.create.mock.calls[0][0];
      const passwordMatches = await bcrypt.compare(
        userData.password,
        createCall.data.password,
      );
      expect(passwordMatches).toBe(true);
      expect(result).toEqual(createdUser);
    });

    it('lanza error 409 cuando el email ya está registrado', async () => {
      const userData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'existing-user',
        email: userData.email,
      });
      vi.spyOn(prisma.user, 'create');

      await expect(registerUser(userData)).rejects.toMatchObject({
        message: 'El email ya está registrado',
        status: 409,
      });

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('inicia sesión con credenciales válidas', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const user = {
        id: 'user-1',
        email: 'juan@example.com',
        name: 'Juan Pérez',
        password: hashedPassword,
        role: 'USER',
      };

      vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      const result = await loginUser({
        email: user.email,
        password: plainPassword,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: user.email },
      });
      expect(result).toMatchObject({
        token: expect.any(String),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    });

    it('lanza error 401 cuando la contraseña es incorrecta', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);

      vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'user-1',
        email: 'juan@example.com',
        name: 'Juan Pérez',
        password: hashedPassword,
        role: 'USER',
      });

      await expect(
        loginUser({
          email: 'juan@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toMatchObject({
        message: 'Credenciales inválidas',
        status: 401,
      });
    });

    it('lanza error 401 cuando el usuario no existe', async () => {
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        loginUser({
          email: 'noexiste@example.com',
          password: 'password123',
        }),
      ).rejects.toMatchObject({
        message: 'Credenciales inválidas',
        status: 401,
      });
    });
  });
});
