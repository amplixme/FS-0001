const prisma = require('../config/prisma');
const AppError = require('../utils/AppErrors');

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
      categories: true,
    },
  });

  return post;
};

const getAllPosts = async ({
  categorySlug,
  search,
  page = 1,
  limit = 10,
  sort = 'newest',
} = {}) => {
  const sortMap = {
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    comments: { comments: { _count: 'desc' } },
  };

  const orderBy = sortMap[sort] || sortMap.newest;
  const skip = (page - 1) * limit;
  const normalizedSearch = search?.trim();

  const where = {
    published: true,

    ...(categorySlug && {
      categories: { some: { slug: categorySlug } },
    }),

    ...(normalizedSearch && {
      OR: [
        {
          title: {
            contains: normalizedSearch,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: normalizedSearch,
            mode: 'insensitive',
          },
        },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: { select: { name: true } },
        categories: true,
        _count: { select: { comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data: posts.map((p) => ({ ...p, commentCount: p._count.comments })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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
      categories: true,
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
      categories: true,
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
