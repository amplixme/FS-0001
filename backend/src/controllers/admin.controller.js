const { getStats, getUsers, createAdminUser, toggleUserRole, updateUser } = require('../services/admin.service');
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

module.exports = {
  stats,
  users,
  createUser,
  changeRole,
  update,
};