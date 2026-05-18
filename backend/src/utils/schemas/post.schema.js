const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  published: z.boolean().optional(),
});

const updatePostSchema = z
  .object({
    title: z.string().min(1, 'El título no puede estar vacío').optional(),
    content: z.string().min(1, 'El contenido no puede estar vacío').optional(),
    published: z.boolean().optional(),
    coverImage: z.string().url().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined ||
      data.published !== undefined,
    { message: 'Debes enviar al menos un campo para actualizar' },
  );

module.exports = { createPostSchema, updatePostSchema };
