const { getPublicProfile, updateMyProfile } = require('../services/user.service');
const { success } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const profile = await getPublicProfile(req.params.id);

    return success(res, profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await updateMyProfile(req.user.id, req.body);

    return success(res, user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};