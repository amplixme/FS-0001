import api from '@/services/api';

const getAll = async () => {
  try {
    const response = await api.get('/categories');
    return response.data.data || response.data;
  } catch (error) {
    const message =
      error.response?.data?.error?.message || 'Error al obtener categorías';
    throw new Error(message, { cause: error });
  }
};

const create = async (data) => {
  try {
    const response = await api.post('/categories', data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error?.message || 'Error al crear la categoría';
    throw new Error(message, { cause: error });
  }
};

const update = async (id, data) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      'Error al actualizar la categoría';
    throw new Error(message, { cause: error });
  }
};

const remove = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      const message =
        error.response?.data?.error?.message ||
        'No se puede eliminar la categoría porque tiene posts asociados';
      throw new Error(message, { cause: error });
    }
    const message =
      error.response?.data?.error?.message || 'Error al eliminar la categoría';
    throw new Error(message, { cause: error });
  }
};

export { getAll, create, update, remove };
