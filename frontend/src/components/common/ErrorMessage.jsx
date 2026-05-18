import { AlertCircle } from 'lucide-react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-700 font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-full text-white text-sm font-semibold bg-blue-600 hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
