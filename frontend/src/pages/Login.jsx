import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import api from '@/services/api';

import { Card } from '@/components/ui/card';
import { Mail, Lock } from 'lucide-react';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError('');

      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      login(response.data.data.token, response.data.data.user);

      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.error?.message || 'Ocurrió un error al logearse';

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
            Iniciar sesión
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Ingresa a tu cuenta para continuar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email inválido',
                    },
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

            {serverError && (
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: '#2563eb' }}
            >
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-7">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              style={{ color: '#2563eb' }}
              className="font-semibold hover:underline"
            >
              Regístrate
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

export default Login;
