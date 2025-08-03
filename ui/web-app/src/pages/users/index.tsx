import { generatePath, useNavigate } from 'react-router';
import { Plus, Pencil, Trash } from 'lucide-react';

import { routerPathConfig } from '@/consts/routerPaths';

import { useUsers } from '@/hooks/users/use-users';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { Container } from '@/components/container';
import { TypographyH2 } from '@/components/typography';
import { useDeleteUser } from '@/hooks/users/use-delete-user';
import { toast } from 'sonner';

const UsersPage = () => {
  const navigate = useNavigate();
  const { data, status, error, refetch } = useUsers();
  const users = data?.data;
  const { mutateAsync: deleteUser } = useDeleteUser();

  return (
    <Container className="space-y-4">
      <div className="flex justify-between items-center">
        <TypographyH2>User Management</TypographyH2>
        <Button
          onClick={() => {
            navigate(generatePath(routerPathConfig.usersCreate.pathname));
          }}
          variant="outline"
          size="sm"
        >
          <Plus />
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-6">
        {(() => {
          switch (status) {
            case 'pending':
              return [...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Skeleton className="h-5 w-24 rounded" />
                      <Skeleton className="h-4 w-32 rounded ml-2" />
                    </CardTitle>
                    <CardAction className="flex items-center gap-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-3 w-40 mb-2 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </CardContent>
                </Card>
              ));
            case 'error':
              return <div className="text-destructive">{String(error)}</div>;

            case 'success':
            default:
              return users && users.length > 0 ? (
                users.map((user) => (
                  <Card key={user.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>
                        {user.name}{' '}
                        <span className="ml-2 text-muted-foreground text-xs">
                          ({user.email})
                        </span>
                      </CardTitle>
                      <CardAction className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            navigate(
                              generatePath(
                                routerPathConfig.usersEdit.pathname,
                                {
                                  userId: user.id,
                                },
                              ),
                            );
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={async () => {
                            const toastId = toast.loading('Deleting...');
                            try {
                              await deleteUser({ path: { id: user.id } });
                              toast.dismiss(toastId);
                              toast.success('Delete successful');
                              await refetch();
                            } catch (error) {
                              toast.dismiss(toastId);
                              toast.error(
                                'Delete failed: ' +
                                  (error instanceof Error
                                    ? error.message
                                    : 'Unknown error'),
                              );
                            }
                          }}
                        >
                          <Trash />
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        ID: {user.id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(user.createdAt).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No users found.
                </div>
              );
          }
        })()}
      </div>
    </Container>
  );
};

export default UsersPage;
