import api from '@/services/api';

const handleApiError = (error) => {
  const message =
    error.response?.data?.error?.message ||
    'Ocurrió un error al procesar tu solicitud.';
  throw new Error(message);
};

const getProfile = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateProfile = async (data) => {
  try {
    const response = await api.put('/users/me', data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export { getProfile, updateProfile };
