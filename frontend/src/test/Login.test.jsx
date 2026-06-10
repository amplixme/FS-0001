import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import api from '@/services/api';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra errores de validación al enviar el formulario vacío', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(
      await screen.findByText('El email es obligatorio'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('La contraseña es obligatoria'),
    ).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('muestra error cuando la contraseña es demasiado corta', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(
      screen.getByPlaceholderText('ejemplo@correo.com'),
      'test@example.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '123');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(
      await screen.findByText('Debe tener al menos 6 caracteres'),
    ).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('envía las credenciales y redirige al home en un login exitoso', async () => {
    const user = userEvent.setup();

    api.post.mockResolvedValue({
      data: {
        data: {
          token: 'jwt-token',
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
        },
      },
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText('ejemplo@correo.com'),
      'test@example.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockLogin).toHaveBeenCalledWith('jwt-token', {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
