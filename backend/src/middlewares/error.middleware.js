const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 'P2002') {
    return error(res, 'Resource already exist', 409);
  }

  if (err.code === 'P2025') {
    return error(res, 'Resource not found', 404);
  }

  const message = err.message || 'Server error';
  const status = err.status || 500;
  return error(res, message, status);
};

module.exports = errorHandler;
