import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const DangerZoneSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-6 w-32" />
      <Separator className="my-2" />
      <Skeleton className="h-8 w-36" />
    </div>
  );
};
