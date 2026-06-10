const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../services/category.service');
const { success } = require('../utils/response');

const getAll = async (_req, res, next) => {
  try {
    const categories = await getAllCategories();
    return success(res, categories);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const category = await createCategory({ name, slug });
    return success(res, category, 201);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    return success(res, category);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    return success(res, { message: 'Categoría eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, remove };
