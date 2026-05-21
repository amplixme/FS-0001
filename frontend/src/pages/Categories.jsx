import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

import { getAll, create, update, remove } from '@/services/category.service';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import ConfirmModal from '@/components/common/ConfirmModal';
import Spinner from '@/components/common/Spinner';
import ErrorMessage from '@/components/common/ErrorMessage';

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { name: '' } });

  const watchedName = watch('name');
  const generatedSlug = generateSlug(watchedName || '');

  const fetchCategories = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const data = await getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onSubmitCreate = async (formData) => {
    try {
      await create({ name: formData.name.trim(), slug: generatedSlug });
      toast.success('Categoría creada');
      reset();
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id) => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    try {
      setSavingEdit(true);
      await update(id, { name: trimmed, slug: generateSlug(trimmed) });
      toast.success('Categoría actualizada');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (cat) => {
    try {
      await remove(cat.id);
      toast.success('Categoría eliminada');
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <div className="min-h-screen bg-[#f0f2f5] px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administrá las categorías del blog
          </p>
        </div>

        <Card className="overflow-hidden rounded-2xl shadow-sm">
          <div
            className="h-1.5 w-full"
            style={{
              background: 'linear-gradient(to right, #2563eb, #38bdf8)',
            }}
          />
          <div className="px-8 py-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Nueva categoría
            </h2>

            <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <Field>
                    <FieldLabel>Nombre</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="Ej. Programación"
                        {...register('name', {
                          required: 'El nombre es obligatorio',
                        })}
                      />
                    </FieldContent>
                  </Field>
                </div>

                <div className="flex-1">
                  <Field>
                    <FieldLabel>Slug (auto-generado)</FieldLabel>
                    <FieldContent>
                      <Input
                        value={generatedSlug}
                        readOnly
                        className="cursor-default bg-gray-50 text-gray-500"
                      />
                    </FieldContent>
                  </Field>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !watchedName?.trim()}
                    className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Crear
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        <Card className="overflow-hidden rounded-2xl shadow-sm">
          {categories.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-400">
              No hay categorías todavía. ¡Creá la primera!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  {editingId === cat.id ? (
                    <div className="flex flex-1 items-center gap-3">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nombre"
                        className="flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(cat.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <span className="hidden text-sm text-gray-400 sm:inline">
                        {generateSlug(editName)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(cat.id)}
                        disabled={savingEdit || !editName.trim()}
                      >
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={savingEdit}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900">
                          {cat.name}
                        </p>
                        <p className="truncate text-sm text-gray-400">
                          /{cat.slug}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => startEdit(cat)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <ConfirmModal
                          trigger={
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Eliminar categoría"
                          description={
                            cat._count?.posts > 0
                              ? `"${cat.name}" tiene ${cat._count.posts} post(s) asociado(s) y no se puede eliminar.`
                              : `¿Estás seguro de eliminar "${cat.name}"?`
                          }
                          confirmText="Eliminar"
                          onConfirm={() => handleDelete(cat)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Categories;
