const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppErrors');

const prisma = new PrismaClient();

const getPublicProfile = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  return {
    id: user.id,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    postsCount: user._count.posts,
  };
};

const updateMyProfile = async (userId, data) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
      role: true,
    },
  });

  return updatedUser;
};

module.exports = { getPublicProfile, updateMyProfile };
