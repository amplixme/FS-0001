import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';

function PostForm({
  register,
  errors,
  watch,
  isSubmitting,
  submitLabel,
  loadingLabel,
  serverError,
  title,
  subtitle,
}) {
  const published = watch('published');

  return (
    <div
      style={{ backgroundColor: '#f0f2f5' }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(to right, #2563eb, #38bdf8)' }}
        />

        <div className="px-10 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-500 text-sm mb-8">{subtitle}</p>

          <div className="space-y-5">
            <Field>
              <FieldLabel>Título</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Ej. Arquitectura Limpia en React"
                  {...register('title', {
                    required: 'El título es obligatorio',
                  })}
                />
              </FieldContent>
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Contenido</FieldLabel>
              <FieldContent>
                <textarea
                  rows={8}
                  placeholder="Escribí el contenido del artículo..."
                  className="w-full rounded-xl px-4 py-3 bg-gray-100 text-sm text-gray-700 placeholder-gray-400 outline-none resize-none"
                  {...register('content', {
                    required: 'El contenido es obligatorio',
                  })}
                />
              </FieldContent>
              {errors.content && (
                <FieldError>{errors.content.message}</FieldError>
              )}
            </Field>

            <Field>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  {...register('published')}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <label
                  htmlFor="published"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {published ? 'Guardar como borrador' : 'Publicar ahora'}
                </label>
              </div>
            </Field>

            {serverError && (
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: '#2563eb' }}
            >
              {isSubmitting ? loadingLabel : submitLabel}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PostForm;
