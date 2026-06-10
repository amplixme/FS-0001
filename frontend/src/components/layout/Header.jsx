import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const currentSort = searchParams.get('sort');

  const sortTabs = [
    {
      label: 'Más recientes',
      sort: 'newest',
      isActive: isHome && (!currentSort || currentSort === 'newest'),
    },
    {
      label: 'Más comentados',
      sort: 'comments',
      isActive: isHome && currentSort === 'comments',
    },
    {
      label: 'Más antiguos',
      sort: 'oldest',
      isActive: isHome && currentSort === 'oldest',
    },
  ];

  const tabClass = (active) =>
    active
      ? 'font-semibold text-blue-600'
      : 'text-gray-600 hover:text-gray-900 transition-colors';
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-xl font-bold"
          onClick={() => setIsMenuOpen(false)}
        >
          TuProyecto
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {sortTabs.map(({ label, sort, isActive }) => (
            <Link
              key={sort}
              to={`/?sort=${sort}`}
              onClick={() => setIsMenuOpen(false)}
              className={tabClass(isActive)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium">{user.name}</span>
              <button
                onClick={logout}
                className={buttonVariants({ variant: 'outline' })}
              >
                Logout
              </button>
              <Link
                to="/categorias"
                className={buttonVariants({ variant: 'ghost' })}
              >
                Categorías
              </Link>
              <Link
                to="/posts/create"
                className={buttonVariants({ variant: 'default' })}
              >
                Nuevo post
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'outline' })}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={buttonVariants({ variant: 'default' })}
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t bg-white px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-4">
            {sortTabs.map(({ label, sort, isActive }) => (
              <Link
                key={sort}
                to={`/?sort=${sort}`}
                onClick={() => setIsMenuOpen(false)}
                className={tabClass(isActive)}
              >
                {label}
              </Link>
            ))}
            <hr />

            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium">{user.name}</span>
                <Link to="/categorias" onClick={() => setIsMenuOpen(false)}>
                  Categorías
                </Link>
                <button
                  onClick={logout}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Logout
                </button>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={buttonVariants({ variant: 'default' })}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
