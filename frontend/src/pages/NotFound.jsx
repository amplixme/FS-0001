import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-2">
        <FileQuestion className="w-12 h-12 text-blue-600" />
      </div>
      <h1 className="text-8xl font-extrabold text-gray-900">404</h1>
      <p className="text-xl font-semibold text-gray-700">
        Página no encontrada
      </p>
      <p className="text-gray-400 text-md max-w-xs">
        La página que buscás no existe o fue movida a otra dirección.
      </p>
      <Link
        to="/"
        className="mt-4 px-6 py-2.5 rounded-full text-white text-sm font-semibold bg-blue-600 hover:opacity-90 transition-opacity"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFound;
