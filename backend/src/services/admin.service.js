const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppErrors');
const { createUser } = require('./auth.service');

const prisma = new PrismaClient();

const getStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return {
    totalUsers,
    totalPosts,
    totalComments,
    postsByCategory: categories.map((category) => ({
      id: category.id,
      name: category.name,
      count: category._count.posts,
    })),
  };
};

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    postsCount: user._count.posts,
  }));
};

const createAdminUser = async ({
  name,
  email,
  password,
  role,
}) => {
  const user = await createUser({
    name,
    email,
    password,
    role,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

const toggleUserRole = async ({ id, currentUserId }) => {
  if (id === currentUserId) {
    throw new AppError('No puedes modificar tu propio rol', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      role: newRole,
    },
  });

  return updatedUser;
};

const updateUser = async ({ id, data, currentUserId }) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new AppError('El email ya está registrado', 409);
    }
  }

  if (
    id === currentUserId &&
    data.role &&
    data.role !== user.role
  ) {
    throw new AppError(
      'No puedes modificar tu propio rol',
      400,
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
    },
  });

  return updatedUser;
};

const deleteUser = async ({ userId, currentUserId }) => {
  if (userId === currentUserId) {
    throw new AppError('No puedes eliminar tu propio usuario', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  await prisma.user.delete({
    where: { id: userId },
  });
};

module.exports = {
  getStats, getUsers, createAdminUser, toggleUserRole, updateUser, deleteUser,
};