import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';

function ErrorFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-2">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-5xl font-extrabold text-gray-900">Algo salió mal</h2>
      <p className="text-gray-500 text-md max-w-xs">
        Ocurrió un error inesperado. <br />
        Intentá recargar la página.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2.5 rounded-full text-white text-sm font-semibold bg-blue-600 hover:opacity-90 transition-opacity"
      >
        Recargar página
      </button>
    </div>
  );
}

function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}

export default AppErrorBoundary;
