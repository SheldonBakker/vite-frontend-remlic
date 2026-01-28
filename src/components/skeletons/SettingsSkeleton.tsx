import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonCard } from './SkeletonCard';

export function SettingsSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} hasContent hasAction />
        ))}
      </div>
    </div>
  );
}
