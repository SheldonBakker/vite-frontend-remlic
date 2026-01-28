import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
  hasContent?: boolean;
  hasAction?: boolean;
}

export function SkeletonCard({ hasContent = false, hasAction = false }: SkeletonCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <div className={`flex items-center ${hasAction ? 'justify-between' : 'gap-3'}`}>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          {hasAction && <Skeleton className="h-5 w-9 rounded-full" />}
        </div>
      </CardHeader>
      {hasContent && (
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
