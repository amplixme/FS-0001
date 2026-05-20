import api from '@/services/api';

const getAll = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error?.message || 'Error al obtener categorías';
    throw new Error(message);
  }
};

export { getAll };
