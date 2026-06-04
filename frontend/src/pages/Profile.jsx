import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getProfile } from '@/services/user.service';
import { getAll } from '@/services/post.service';
import PostCard from '@/components/posts/PostCard';
import Spinner from '@/components/common/Spinner';
import { User, FileText } from 'lucide-react';

function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await getProfile(id);
        setProfile(profileResponse.data);

        const postsResponse = await getAll({ authorId: id, limit: 100 });
        setPosts(postsResponse.posts || []);
      } catch (err) {
        setError(err.message || 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  const isOwnProfile = user?.id === id;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {profile.name}
            </h1>

            {profile.bio && (
              <p className="text-gray-500 text-sm mb-3">{profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <FileText size={14} />
                {profile.postsCount}{' '}
                {profile.postsCount === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => navigate('/')}
              className="bg-blue-700 text-white px-4 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-blue-700/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Editar perfil
            </button>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Artículos del perfil
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Este usuario no tiene publicaciones todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                author={post.author?.name}
                createdAt={post.createdAt}
                coverImage={post.coverImage}
                categories={post.categories || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
