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
const updateComment = async ({ id, content, user }) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new AppError('Comentario no encontrado', 404);
  }

  if (comment.authorId !== user.id) {
    throw new AppError('No autorizado', 403);
  }

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: { content },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return updatedComment;
};

const deleteComment = async ({ id, user }) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new AppError('Comentario no encontrado', 404);
  }

  const isAuthor = comment.authorId === user.id;
  const isAdmin = user.role === 'ADMIN';

  if (!isAuthor && !isAdmin) {
    throw new AppError('No autorizado', 403);
  }

  await prisma.comment.delete({
    where: { id },
  });
};

module.exports = { createComment, updateComment, deleteComment };
