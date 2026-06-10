import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '@/components/posts/PostCard';
import CategoryFilter from '@/components/common/CategoryFilter';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import Spinner from '@/components/common/Spinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import { getAll } from '@/services/post.service';
import { getAll as getAllCategories } from '@/services/category.service';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 9);
  const sort = searchParams.get('sort') ?? undefined;
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? null;

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(category);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data || response);
      } catch (_err) {
        console.error('Error al cargar categorías:', _err);
      }
    };
    loadCategories();
  }, []);

  const handleCategorySelect = useCallback(
    (cat) => {
      setActiveCategory(cat);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', '1');
        if (cat) next.set('category', cat);
        else next.delete('category');
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSearch = useCallback(
    (value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', '1');
        if (value) next.set('search', value);
        else next.delete('search');
        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAll({
          page,
          limit,
          category: activeCategory || undefined,
          sort,
          search: search || undefined,
        });
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch {
        setError('Error al cargar los posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [activeCategory, page, limit, sort, search, retryCount]);

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />

        <div className="flex-1">
          <div className="mb-6">
            <SearchInput value={search} onChange={handleSearch} />
          </div>

          {posts.length === 0 ? (
            <EmptyState message="No hay publicaciones que coincidan con tu búsqueda" />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    author={post.author?.name}
                    authorId={post.authorId}
                    coverImage={post.coverImage}
                    createdAt={post.createdAt}
                    categories={post.categories || []}
                    commentsCount={post.commentCount}
                    onCategoryClick={handleCategorySelect}
                  />
                ))}
              </div>
              <Pagination totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
