const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: { message: 'No tienes permisos para realizar esta acción' },
      });
    }
    next();
  };

module.exports = requireRole;
