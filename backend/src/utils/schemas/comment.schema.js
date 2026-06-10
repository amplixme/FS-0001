const { z } = require('zod');

const createCommentSchema = z.object({
  content: z.string().min(1, 'El contenido es requerido'),
});

const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'El comentario no puede estar vacío')
    .max(500, 'Máximo 500 caracteres'),
});

module.exports = { createCommentSchema, updateCommentSchema };
