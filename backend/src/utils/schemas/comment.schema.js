const { z } = require('zod');

const createCommentSchema = z.object({
  content: z.string().min(1, 'El contenido es requerido'),
});

module.exports = { createCommentSchema };