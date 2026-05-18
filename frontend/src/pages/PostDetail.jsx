import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import ConfirmModal from '@/components/common/ConfirmModal';
import { getById, delete as deletePost } from '@/services/post.service';
import { Pencil, Trash2 } from 'lucide-react';

function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getById(id);
        setPost(response.data);
      } catch (err) {
        setError('No se pudo cargar el post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!post) return <p className="text-center mt-10">Post no encontrado</p>;

  const isAuthor = user?.id === post.authorId;

  const handleDelete = async () => {
    try {
      await deletePost(id);
      toast.success('Artículo eliminado correctamente');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-outline hover:text-primary mb-8"
      >
        ← Volver a inicio
      </Link>

      <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-on-surface mb-6">
        {post.title}
      </h1>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline font-bold">
          {post.author?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-on-surface">
            {post.author?.name}
          </span>
          <span className="text-xs text-outline">
            {new Date(post.createdAt).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="text-lg leading-relaxed text-on-surface-variant mb-10">
        {post.content}
      </div>

      {isAuthor && (
        <div className="flex items-center justify-end gap-3 mt-16 pt-8 border-t border-outline-variant/20">
          <button
            onClick={() => navigate(`/posts/${id}/edit`)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-400 text-gray-800 hover:bg-gray-100 transition-all text-sm font-semibold"
          >
            <Pencil size={16} />
            Editar
          </button>
          <ConfirmModal
            description="¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer."
            onConfirm={handleDelete}
            trigger={
              <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 transition-all text-sm font-semibold">
                <Trash2 size={16} />
                Eliminar
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}

export default PostDetail;
