import { User, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatRelativeTime } from '../../utils/formatRelativeTime.js';

function PostCard({
  id,
  title,
  content,
  author,
  createdAt,
  coverImage,
  categories = [],
  commentsCount = 0,
  onCategoryClick,
}) {
  const navigate = useNavigate();

  const excerpt =
    content?.length > 150 ? content.slice(0, 150) + '...' : content;

  const date = formatRelativeTime(createdAt);

  const visibleCategories = categories.slice(0, 3);
  const remainingCount = categories.length - visibleCategories.length;

  const handleCategoryClick = (e, slug) => {
    e.stopPropagation();
    if (onCategoryClick) onCategoryClick(slug);
  };

  return (
    <Card
      className="w-full max-w-sm cursor-pointer hover:shadow-lg transition-shadow rounded-2xl overflow-hidden shadow-md flex flex-col"
      onClick={() => navigate(`/posts/${id}`)}
    >
      <div className="w-full aspect-video overflow-hidden relative bg-slate-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-700 via-slate-800 to-slate-900 flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-8 h-8 text-slate-400/70" />
            <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Sin portada
            </span>
          </div>
        )}
      </div>

      <CardContent className="pt-4 flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleCategories.map((cat) => (
            <span
              key={cat.id}
              onClick={(e) => handleCategoryClick(e, cat.slug)}
              className="inline-block bg-cyan-400 text-cyan-900 text-xs font-bold px-3 py-1 rounded-full hover:bg-cyan-500 transition-colors"
            >
              {cat.name.toUpperCase()}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-block bg-gray-300 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">{author} 💬 {commentsCount ?? 0}</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
