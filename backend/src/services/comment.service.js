const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppErrors');
const prisma = new PrismaClient();

const createComment = async ({ content, postId, authorId }) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post no encontrado', 404);
  }

  const comment = await prisma.comment.create({
    data: { content, postId, authorId },
    include: {
      author: { select: { name: true } },
    },
  });

  return comment;
};

const getCommentsByPost = async (postId) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return comments;
};

module.exports = { createComment, getCommentsByPost };