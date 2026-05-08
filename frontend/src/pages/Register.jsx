import { useForm } from 'react-hook-form';

function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const password = getValues('password');

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <div className="mx-auto mt-10 max-w-md px-4">
      <h1 className="mb-6 text-2xl font-bold">
        Crear cuenta
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div>
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full rounded border p-3"
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: {
                value: 2,
                message: 'Debe tener al menos 2 caracteres',
              },
            })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full rounded border p-3"
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded border p-3"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 8,
                message: 'Debe tener al menos 8 caracteres',
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full rounded border p-3"
            {...register('confirmPassword', {
              required: 'Confirmá tu contraseña',
              validate: (value) =>
                value === password || 'Las contraseñas no coinciden',
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 p-3 text-white"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}

export default Register;