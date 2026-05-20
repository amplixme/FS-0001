const { error } = require('../utils/response');
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 'P2002') {
    return error(res, 'Resource already exist', 409);
  }

  if (err.code === 'P2025') {
    return error(res, 'Resource not found', 404);
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: {
        message: 'La imagen supera el tamaño máximo de 5MB',
      },
    });
  }

  if (err.message.includes('Solo se permiten imágenes')) {
    return res.status(400).json({
      error: {
        message: err.message,
      },
    });
  }

  const message = err.message || 'Server error';
  const status = err.status || 500;
  return error(res, message, status);
};

module.exports = errorHandler;
