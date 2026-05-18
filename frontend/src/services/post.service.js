import api from '@/services/api';

const handleApiError = (error) => {
  const message =
    error.response?.data?.error?.message ||
    'Ocurrió un error al procesar la solicitud';

  throw new Error(message);
};

const getAll = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const create = async (data) => {
  try {
    const response = await api.post('/posts', data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const update = async (id, data) => {
  try {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const remove = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export { getAll, getById, create, update, remove as delete };
