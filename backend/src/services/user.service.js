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

module.exports = { getPublicProfile };