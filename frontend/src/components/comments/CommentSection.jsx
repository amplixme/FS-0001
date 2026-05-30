import { useCallback, useEffect, useState } from 'react';
import {
  create,
  delete as deleteComment,
  getByPostId,
  update,
} from '@/services/comment.service';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/common/ConfirmModal';
import { Pencil, Trash2 } from 'lucide-react';

const getRelativeTime = (date) => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffInSeconds = Math.floor((now - commentDate) / 1000);

  if (diffInSeconds < 60) return 'Hace unos segundos';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }

  return commentDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getInitials = (name = 'Usuario') => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

function CommentSection({ postId }) {
  const { isAuthenticated, user } = useAuth();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
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
  }, [postId]);

  useEffect(() => {
    if (postId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchComments();
    }
  }, [fetchComments, postId]);

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

      setComments((currentComments) => [
        response.data,
        ...currentComments,
      ]);

      setContent('');
    } catch (error) {
      setError(error.message || 'No se pudo crear el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
    setError('');
  };

  const handleCancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleSaveEditing = async (commentId) => {
    const trimmedContent = editingContent.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      const response = await update(commentId, {
        content: trimmedContent,
      });

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );

      handleCancelEditing();
    } catch (error) {
      setError(error.message || 'No se pudo actualizar el comentario');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setDeletingCommentId(commentId);
      setError('');

      await deleteComment(commentId);
      await fetchComments();
    } catch (error) {
      setError(error.message || 'No se pudo eliminar el comentario');
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <section className="max-w-[720px] mx-auto mt-20 pt-10 border-t border-slate-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-8">
        Comentarios ({comments.length})
      </h3>

      {isAuthenticated ? (
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
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-12 text-center">
          <p className="text-slate-600 text-sm">
            Inicia sesión para comentar.{' '}
            <Link
              to="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Ir al login
            </Link>
          </p>
        </div>
      )}

      {loading && (
        <p className="text-slate-500 text-sm">
          Cargando comentarios...
        </p>
      )}

      {!loading && error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="text-slate-500 text-sm">
          Aún no hay comentarios. ¡Sé el primero!
        </p>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="space-y-8">
          {comments.map((comment) => {
            const authorName = comment.author?.name || 'Usuario';
            const isOwnComment = user?.id === comment.authorId;
            const isEditing = editingCommentId === comment.id;

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
                          {getRelativeTime(comment.createdAt)}
                        </span>
                      </div>

                      {isOwnComment && !isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEditing(comment)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors"
                          >
                            <Pencil size={14} />
                            Editar
                          </button>

                          <ConfirmModal
                            description="Â¿EstÃ¡s seguro de que deseas eliminar este comentario? Esta acciÃ³n no se puede deshacer."
                            onConfirm={() => handleDelete(comment.id)}
                            trigger={
                              <button
                                type="button"
                                disabled={deletingCommentId === comment.id}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </button>
                            }
                          />
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-3">
                        <textarea
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                          rows={3}
                          value={editingContent}
                          onChange={(event) =>
                            setEditingContent(event.target.value)
                          }
                        />

                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={handleCancelEditing}
                            disabled={saving}
                            className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancelar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveEditing(comment.id)}
                            disabled={saving || !editingContent.trim()}
                            className="px-4 py-2 rounded-full bg-blue-700 text-white text-xs font-bold hover:shadow-lg hover:shadow-blue-700/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {comment.content}
                      </p>
                    )}
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
