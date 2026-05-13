const { createPost, getAllPosts, getPostById } = require('../services/post.service');
const { success } = require('../utils/response');

const create = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user.id;

        const post = await createPost({ title, content, authorId });
        return success(res, post, 201);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    return success(res, posts);
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

module.exports = { create, getAll, getById };