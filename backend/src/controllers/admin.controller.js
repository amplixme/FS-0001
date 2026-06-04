const { getStats, getUsers, getAdminPosts, getAdminComments, createAdminUser, toggleUserRole, updateUser, deleteUser, adminDeletePost, adminDeleteComment } = require('../services/admin.service');
const { success } = require('../utils/response');

const stats = async (req, res, next) => {
  try {
    const data = await getStats();

    return success(res, data);
  } catch (error) {
    next(error);
  }
};

const users = async (req, res, next) => {
  try {
    const data = await getUsers();

    return success(res, data);
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await adminService.getAdminPosts();

    return success(res, posts);
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await adminService.getAdminComments();

    return success(res, comments);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await createAdminUser(req.body);

    return success(res, user, 201);
  } catch (error) {
    next(error);
  }
};

const changeRole = async (req, res, next) => {
  try {
    const user = await toggleUserRole({
      id: req.params.id,
      currentUserId: req.user.id,
    });

    return success(res, user);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await updateUser({
      id: req.params.id,
      data: req.body,
      currentUserId: req.user.id,
    });

    return success(res, user);
  } catch (error) {
    next(error);
  }
};

const removeUser = async (req, res, next) => {
  try {
    await deleteUser({
      userId: req.params.id,
      currentUserId: req.user.id,
    });

    return success(res, {
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

const removePost = async (req, res, next) => {
  try {
    await adminDeletePost(req.params.id);

    return success(res, {
      message: 'Post eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

const removeComment = async (req, res, next) => {
  try {
    await adminDeleteComment(req.params.id);

    return success(res, {
      message: 'Comentario eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  stats,
  users,
  getPosts,
  getComments,
  createUser,
  changeRole,
  update,
  removeUser,
  removePost,
  removeComment,
};