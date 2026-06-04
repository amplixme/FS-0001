import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, '...', total];
  if (current >= total - 3) return [1, '...', total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function Pagination({ totalPages }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page') ?? 1);

  const goTo = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
  };

  const pages = getPages(currentPage, totalPages);

  return (
    <nav
      aria-label="Paginación"
      className="border-t border-slate-100 mt-8 py-12"
    >
      {/* Mobile: dots */}
      <div className="flex md:hidden justify-between items-center">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-2 text-sm font-bold
            disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50
            text-[#024ce2] active:scale-95 transition-transform"
          aria-label="Página anterior"
        >
          <ArrowLeft size={16} />
          Anterior
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i + 1)}
              aria-current={currentPage === i + 1 ? 'page' : undefined}
              aria-label={`Página ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentPage === i + 1 ? 'bg-[#024ce2]' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-2 text-sm font-bold
            disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50
            text-[#024ce2] active:scale-95 transition-transform"
          aria-label="Página siguiente"
        >
          Siguiente
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Desktop: números */}
      <div className="hidden md:flex justify-center items-center gap-1">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg
            disabled:text-slate-300 disabled:cursor-not-allowed
            text-slate-500 hover:bg-slate-100 active:scale-95 transition-all"
          aria-label="Página anterior"
        >
          <ArrowLeft size={16} />
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goTo(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                currentPage === page
                  ? 'bg-[#024ce2] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg
            disabled:text-slate-300 disabled:cursor-not-allowed
            text-slate-500 hover:bg-slate-100 active:scale-95 transition-all"
          aria-label="Página siguiente"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
