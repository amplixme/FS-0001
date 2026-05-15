import { useState, useEffect } from 'react';
import PostCard from '@/components/posts/PostCard';
import { getAll } from '@/services/post.service';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAll();
        console.log(response);
        setPosts(response.data);
      } catch (err) {
        setError('Error al cargar los posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {posts.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">No hay post todavía</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              author={post.author?.name}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
