import api from '@/services/api';

const handleApiError = (error) => {
  const message =
    error.response?.data?.error?.message ||
    'Ocurrió un error al procesar la solicitud';

  throw new Error(message);
};

const getStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const createUser = async (data) => {
  try {
    const response = await api.post('/admin/users', data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateUser = async (id, data) => {
  try {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const changeUserRole = async (id) => {
  try {
    const response = await api.patch(`/admin/users/${id}/role`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export {
  getStats,
  getUsers,
  createUser,
  updateUser,
  changeUserRole,
  deleteUser,
};