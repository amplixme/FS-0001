import { useState, useEffect } from 'react';
import PostCard from '@/components/posts/PostCard';
import Spinner from '@/components/common/Spinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import { getAll } from '@/services/post.service';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getAll();
        setPosts(response.data);
      } catch (_err) {
        setError('Error al cargar los posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [retryCount]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <ErrorMessage
        message={error}
        onRetry={() => setRetryCount((c) => c + 1)}
      />
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {posts.length === 0 ? (
        <EmptyState message="No hay publicaciones todavía" />
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
