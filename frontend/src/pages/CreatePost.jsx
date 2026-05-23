import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { create } from '@/services/post.service';
import PostForm from '@/components/posts/PostForm';

function CreatePost() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      published: false,
      categories: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await create(data);
      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      setServerError(error.message || 'Ocurrió un error al crear el post');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PostForm
        register={register}
        errors={errors}
        watch={watch}
        getValues={getValues}
        setValue={setValue}
        isSubmitting={isSubmitting}
        submitLabel="Crear artículo"
        loadingLabel="Creando..."
        serverError={serverError}
        title="Nuevo Post"
        subtitle="Completá los siguientes datos para publicar"
      />
    </form>
  );
}

export default CreatePost;
