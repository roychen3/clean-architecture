import { Skeleton } from '@/components/ui/skeleton';

export const ArticleFormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-5 w-20 mb-1">
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-20 mb-1">
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
