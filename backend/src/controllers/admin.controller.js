const { getStats } = require('../services/admin.service');
const { success } = require('../utils/response');

const stats = async (req, res, next) => {
  try {
    const data = await getStats();

    return success(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  stats,
};