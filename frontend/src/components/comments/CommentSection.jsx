import { useEffect, useState } from 'react';
import { create, getByPostId } from '@/services/comment.service';
import { formatRelativeTime } from '../../utils/formatRelativeTime.js';

const getInitials = (name = 'Usuario') => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await getByPostId(postId);

      setComments(response.data || []);
    } catch (error) {
      setError(error.message || 'No se pudieron cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await create(postId, {
        content: trimmedContent,
      });

      setComments((currentComments) => [response.data, ...currentComments]);

      setContent('');
    } catch (error) {
      setError(error.message || 'No se pudo crear el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-[720px] mx-auto mt-20 pt-10 border-t border-slate-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-8">
        Comentarios ({comments.length})
      </h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 shadow-sm mb-12 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
      >
        <textarea
          className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 resize-none text-sm"
          placeholder="Escribe un comentario..."
          rows={3}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="bg-blue-700 text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-blue-700/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Comentando...' : 'Comentar'}
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-slate-500 text-sm">Cargando comentarios...</p>
      )}

      {!loading && error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && comments.length === 0 && (
        <p className="text-slate-500 text-sm">
          Aún no hay comentarios. ¡Sé el primero!
        </p>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="space-y-8">
          {comments.map((comment) => {
            const authorName = comment.author?.name || 'Usuario';

            return (
              <article key={comment.id} className="group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {getInitials(authorName)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">
                          {authorName}
                        </span>

                        <span className="text-xs text-slate-500">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-sm">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CommentSection;

