const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async ({ title, content, authorId }) => {
    const post = await prisma.post.create({
        data: { title, content, authorId },
        include: {
            author: { select: { name: true } },
        },
    });

    return post;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts;
};

const getPostById = async (id) => {
  const post = await prisma.post.findFirst({
    where: {
      id,
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return post;
};

module.exports = { createPost, getAllPosts, getPostById };