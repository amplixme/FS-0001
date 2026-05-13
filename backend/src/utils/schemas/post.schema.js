const { z } = require('zod');

const createPostSchema = z.object({
    title: z.string().min(1, 'El título es requerido'),
    content: z.string().min(1, 'El contenido es requerido'),
});

module.exports = { createPostSchema };