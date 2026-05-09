const { registerUser, loginUser } = require('../services/auth.service');
const { success } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    await registerUser(req.body);
    return success(res, { message: 'Usuario registrado exitosamente' }, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    return success(res, data, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
