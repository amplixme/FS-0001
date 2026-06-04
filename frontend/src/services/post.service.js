import api from '@/services/api';

const handleApiError = (error) => {
  const message =
    error.response?.data?.error?.message ||
    'Ocurrió un error al procesar la solicitud';

  throw new Error(message);
};

const getAll = async ({ page = 1, limit = 9, category, sort, search, ...extra } = {}) => {
  try {
    const response = await api.get('/posts', {
      params: { page, limit, category, sort, search, ...extra },
    });
    const body = response.data;
    // Normalizar respuesta paginada: { posts, totalPages, total, page, limit }
    return {
      posts: body.data ?? body.posts ?? body,
      totalPages: body.totalPages ?? body.meta?.totalPages ?? 1,
      total: body.total ?? body.meta?.total ?? 0,
      page: body.page ?? body.meta?.page ?? page,
      limit: body.limit ?? body.meta?.limit ?? limit,
    };
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
