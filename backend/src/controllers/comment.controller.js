const { createComment, getCommentsByPost } = require('../services/comment.service');
const { success } = require('../utils/response');

const create = async (req, res, next) => {
  try {
    const { content } = req.body;
    const authorId = req.user.id;
    const { postId } = req.params;

    const comment = await createComment({ content, postId, authorId });
    return success(res, comment, 201);
  } catch (error) {
    next(error);
  }
};

const getByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await getCommentsByPost(postId);
    return success(res, comments);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getByPost };