const { PrismaClient } = require('@prisma/client');

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

module.exports = {
  getStats,
};