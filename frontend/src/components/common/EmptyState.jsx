import { FileX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

function EmptyState({ message, action }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-sm w-full text-center">
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <FileX className="w-12 h-12 text-gray-400" />
          <p className="text-gray-500 font-medium">{message}</p>
          {action && action}
        </CardContent>
      </Card>
    </div>
  );
}

export default EmptyState;
