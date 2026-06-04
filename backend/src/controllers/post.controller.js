const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../services/post.service');
const { success } = require('../utils/response');

const create = async (req, res, next) => {
  try {
    const { title, content, published, coverImage } = req.body;
    const authorId = req.user.id;

    const post = await createPost({
      title,
      content,
      published,
      authorId,
      coverImage,
    });
    return success(res, post, 201);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { category, search, page, limit, sort } = req.query;

    const posts = await getAllPosts({
      categorySlug: category,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      sort,
    });

    return res.json(posts);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post no encontrado',
        },
      });
    }

    return success(res, post);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const post = await updatePost({
      id: req.params.id,
      data: req.body,
      user: req.user,
    });

    return success(res, post);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await deletePost({
      id: req.params.id,
      user: req.user,
    });

    return success(res, { message: 'Post eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getById, update, remove };
