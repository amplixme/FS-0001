import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import api from '@/services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/context/AuthContext';

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      termsAccepted: false,
    },
  });

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
    <div className="mx-auto mt-10 max-w-md px-4">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email inválido',
                    },
                  })}
                />
              </FieldContent>

              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Contraseña</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'Debe tener al menos 6 caracteres',
                    },
                  })}
                />
              </FieldContent>

              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
            {serverError && (
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}
            <p className="text-sm text-center text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Regístrate
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
