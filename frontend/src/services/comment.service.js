import api from "@/services/api";

const handleApiError = (error) => {
    const message = 
        error.response?.data?.message ||
        'Ocurrió un error al procesar tu solicitud.';
    throw new Error(message);
};

const getByPostId = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const create = async (postId, data) => {
    try {
        const response = await api.post(`/posts/${postId}/comments`, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const update = async (id, data) => {
    try {
        const response = await api.put(`/comments/${id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const remove = async (id) => {
    try {
        const response = await api.delete(`/comments/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export { getByPostId, create, update, remove as delete };