import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
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
          <Link to="/latest" onClick={() => setIsMenuOpen(false)}>
            Latest
          </Link>
          <Link to="/popular" onClick={() => setIsMenuOpen(false)}>
            Popular
          </Link>
          <Link to="/newsletter" onClick={() => setIsMenuOpen(false)}>
            Newsletter
          </Link>
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
                to="/posts/create"
                className={buttonVariants({ variant: 'default' })}
              >
                Nuevo post
              </Link>
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
            <Link to="/latest" onClick={() => setIsMenuOpen(false)}>
              Latest
            </Link>
            <Link to="/popular" onClick={() => setIsMenuOpen(false)}>
              Popular
            </Link>
            <Link to="/newsletter" onClick={() => setIsMenuOpen(false)}>
              Newsletter
            </Link>

            <hr />

            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium">{user.name}</span>
                <button
                  onClick={logout}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Logout
                </button>
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
