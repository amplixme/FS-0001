import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '@/services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';

import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

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
    <div className="mx-auto mt-10 max-w-md px-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Crear cuenta
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <Field>
              <FieldLabel>Nombre completo</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Ej. Juan Pérez"
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'Debe tener al menos 2 caracteres',
                    },
                  })}
                />
              </FieldContent>

              {errors.name && (
                <FieldError>
                  {errors.name.message}
                </FieldError>
              )}
            </Field>

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

              {errors.email && (
                <FieldError>
                  {errors.email.message}
                </FieldError>
              )}
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
                      value: 8,
                      message: 'Debe tener al menos 8 caracteres',
                    },
                  })}
                />
              </FieldContent>

              {errors.password && (
                <FieldError>
                  {errors.password.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Confirmar contraseña</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Confirmá tu contraseña',
                    validate: (value) =>
                      value === password ||
                      'Las contraseñas no coinciden',
                  })}
                />
              </FieldContent>

              {errors.confirmPassword && (
                <FieldError>
                  {errors.confirmPassword.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <div className="flex items-start gap-3">
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
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Acepto los{' '}
                  <Link
                    to="/terms"
                    className="text-primary hover:underline"
                  >
                    Términos y Condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link
                    to="/privacy"
                    className="text-primary hover:underline"
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
                <FieldError>
                  {errors.termsAccepted.message}
                </FieldError>
              )}
            </Field>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !getValues('termsAccepted')}
            >
              {isSubmitting
                ? 'Creando cuenta...'
                : 'Crear cuenta'}
            </Button>
            {serverError && (
              <p className="text-sm text-red-500 text-center">
                {serverError}
              </p>
            )}

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;