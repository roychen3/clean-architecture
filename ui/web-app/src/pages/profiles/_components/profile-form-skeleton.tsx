import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const ProfileFormSkeleton = () => {
  return (
    <div className="w-full">
      <Skeleton className="h-6 w-24 mb-2" />
      <Separator className="my-2" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-8 w-20 mt-4" />
      </div>
    </div>
  );
};
