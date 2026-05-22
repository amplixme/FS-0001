import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { getById, update } from '@/services/post.service';
import { useAuth } from '@/context/AuthContext';
import PostForm from '@/components/posts/PostForm';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      published: false,
    },
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchPost = async () => {
      try {
        setServerError('');
        const response = await getById(id);
        const post = response.data;

        if (!post) {
          setServerError('Post no encontrado');
          return;
        }

        if (post.authorId !== user.id) {
          navigate('/');
          return;
        }

        reset({
          title: post.title,
          content: post.content,
          published: post.published,
        });
      } catch (error) {
        setServerError(error.message || 'No se pudo cargar el post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user?.id, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await update(id, data);
      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      setServerError(error.message || 'Ocurrió un error al actualizar el post');
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando post...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PostForm
        register={register}
        errors={errors}
        watch={watch}
        isSubmitting={isSubmitting}
        submitLabel="Guardar cambios"
        loadingLabel="Guardando..."
        serverError={serverError}
        title="Editar Post"
        subtitle="Modificá los datos del artículo"
      />
    </form>
  );
}

export default EditPost;
