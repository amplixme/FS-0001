import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

function PostCard({ id, title, content, author, createdAt }) {
  const navigate = useNavigate();

  const excerpt =
    content?.length > 150 ? content.slice(0, 150) + '...' : content;

  const date = new Date(createdAt).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card
      className="w-full max-w-sm cursor-pointer hover:shadow-lg transition-shadow rounded-2xl overflow-hidden shadow-md"
      onClick={() => navigate(`/posts/${id}`)}
    >
      <div className="relative h-48 bg-linear-to-b from-teal-400 to-teal-500" />

      <CardContent className="pt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{excerpt}</p>
      </CardContent>

      <CardFooter className="border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{author}</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
