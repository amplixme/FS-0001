const { createPost } = require('../services/post.service');
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

module.exports = { create };