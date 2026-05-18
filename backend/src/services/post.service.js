const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppErrors');
const prisma = new PrismaClient();

const createPost = async ({
  title,
  content,
  published = false,
  authorId,
  coverImage,
}) => {
  const post = await prisma.post.create({
    data: { title, content, published, authorId, coverImage },
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

const getPostForOwnershipCheck = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new AppError('Post no encontrado', 404);
  }

  return post;
};

const checkPostOwnershipOrAdmin = (post, user) => {
  const isAuthor = post.authorId === user.id;
  const isAdmin = user.role === 'ADMIN';

  if (!isAuthor && !isAdmin) {
    throw new AppError('No tienes permiso para modificar este post', 403);
  }
};

const updatePost = async ({ id, data, user }) => {
  const post = await getPostForOwnershipCheck(id);

  checkPostOwnershipOrAdmin(post, user);

  const updatedPost = await prisma.post.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return updatedPost;
};

const deletePost = async ({ id, user }) => {
  const post = await getPostForOwnershipCheck(id);

  checkPostOwnershipOrAdmin(post, user);

  await prisma.post.delete({
    where: { id },
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  checkPostOwnershipOrAdmin,
  updatePost,
  deletePost,
};
