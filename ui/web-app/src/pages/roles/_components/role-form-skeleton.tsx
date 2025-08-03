import { Skeleton } from '@/components/ui/skeleton';

export function RoleFormSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
