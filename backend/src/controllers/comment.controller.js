const { createComment } = require('../services/comment.service');
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

module.exports = { create };