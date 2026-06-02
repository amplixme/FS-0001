const { z } = require('zod');

const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .optional(),

    bio: z
      .string()
      .max(500, 'La biografía no puede superar los 500 caracteres')
      .optional(),

    avatarUrl: z
      .string()
      .url('La URL del avatar es inválida')
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.bio !== undefined ||
      data.avatarUrl !== undefined,
    {
      message: 'Debes enviar al menos un campo para actualizar',
    },
  );

module.exports = {
  updateProfileSchema,
};