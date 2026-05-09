import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import api from '@/services/api';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Lock } from 'lucide-react';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      termsAccepted: false,
    },
  });

  const password = getValues('password');

  const onSubmit = async (data) => {
    try {
      setServerError('');

      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      navigate('/login', {
        state: {
          successMessage: 'Usuario registrado exitosamente',
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        'Ocurrió un error al registrarse';

      setServerError(message);
    }
  };

  return (
    <div
      style={{ backgroundColor: '#f0f2f5' }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      <Card className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(to right, #2563eb, #38bdf8)' }}
        />

        <div className="px-10 py-10">
          <div className="mb-8">
            <span
              style={{ color: '#2563eb' }}
              className="text-xl font-bold tracking-tight"
            >
              TuProyecto
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Crear cuenta
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Completá tus datos para registrarte
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field>
              <FieldLabel>Nombre completo</FieldLabel>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-100">
                <User size={15} className="text-gray-400 shrink-0" />
                <input
                  placeholder="Ej. Juan Pérez"
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'Debe tener al menos 2 caracteres',
                    },
                  })}
                />
              </div>
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Correo electrónico</FieldLabel>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-100">
                <Mail size={15} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
                  })}
                />
              </div>
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Contraseña</FieldLabel>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-100">
                <Lock size={15} className="text-gray-400 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'Debe tener al menos 6 caracteres',
                    },
                  })}
                />
              </div>
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Confirmar contraseña</FieldLabel>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-100">
                <Lock size={15} className="text-gray-400 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  {...register('confirmPassword', {
                    required: 'Confirmá tu contraseña',
                    validate: (value) =>
                      value === password || 'Las contraseñas no coinciden',
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
            </Field>

            <Field>
              <div className="flex gap-3 items-center">
                <Checkbox
                  id="terms"
                  checked={getValues('termsAccepted')}
                  onCheckedChange={(checked) => {
                    setValue('termsAccepted', checked, {
                      shouldValidate: true,
                    });
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-relaxed text-gray-600"
                >
                  Acepto los{' '}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Términos y Condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Política de Privacidad
                  </Link>{' '}
                  de TuProyecto.
                </label>
              </div>

              <input
                type="hidden"
                {...register('termsAccepted', {
                  required: 'Debes aceptar los términos para continuar',
                })}
              />

              {errors.termsAccepted && (
                <FieldError>{errors.termsAccepted.message}</FieldError>
              )}
            </Field>

            {serverError && (
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !getValues('termsAccepted')}
              className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: '#2563eb' }}
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-7">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              style={{ color: '#2563eb' }}
              className="font-semibold hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </Card>

      <footer className="mt-6 flex items-center gap-4 text-xs text-gray-400">
        <span>© 2024 TUPROYECTO</span>
        <a href="#" className="hover:text-gray-600 transition-colors">
          Privacidad
        </a>
        <a href="#" className="hover:text-gray-600 transition-colors">
          Términos
        </a>
      </footer>
    </div>
  );
}

export default Register;
