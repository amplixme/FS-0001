const { getPublicProfile } = require('../services/user.service');
const { success } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const profile = await getPublicProfile(req.params.id);

    return success(res, profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
};