import { generatePath, useNavigate } from 'react-router';
import { Pencil, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { routerPathConfig } from '@/consts/routerPaths';

import type { Role } from '@/api/role-permissions/dto';

import { useRoles } from '@/hooks/roles/use-roles';
import { useDeleteRole } from '@/hooks/roles/use-delete-role';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { Container } from '@/components/container';
import { TypographyH2 } from '@/components/typography';

const RolesPage = () => {
  const navigate = useNavigate();
  const { data, refetch, status, error } = useRoles();
  const roles = data?.data;
  const { mutateAsync: deleteRole, status: deleteStatus } = useDeleteRole();

  const handleEdit = (role: Role) => {
    navigate(
      generatePath(routerPathConfig.rolesEdit.pathname, { roleId: role.id }),
    );
  };

  const handleDelete = async (roleId: string) => {
    const toastId = toast.loading('Deleting...');
    try {
      await deleteRole({
        path: {
          id: roleId,
        },
      });
      toast.dismiss(toastId);
      toast.success('Delete successful');
      refetch();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        'Delete failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  };

  return (
    <Container className="space-y-4">
      <div className="flex justify-between items-center">
        <TypographyH2>Roles</TypographyH2>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(routerPathConfig.rolesCreate.pathname)}
        >
          <Plus />
        </Button>
      </div>

      <div className="divide-y">
        {(() => {
          switch (status) {
            case 'pending':
              return (
                <div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 p-2">
                      <Skeleton className="flex-1 h-6" />
                      <Skeleton className="size-8" />
                      <Skeleton className="size-8" />
                    </div>
                  ))}
                </div>
              );

            case 'error':
              return <div className="text-destructive">{String(error)}</div>;

            case 'success':
            default:
              return roles && roles.length > 0 ? (
                roles.map((role) => (
                  <div key={role.id} className="flex items-center gap-2 p-2">
                    <span className="flex-1">{role.name}</span>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="size-8"
                      onClick={() => handleDelete(role.id)}
                      disabled={deleteStatus === 'pending'}
                    >
                      <Trash />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      onClick={() => handleEdit(role)}
                    >
                      <Pencil />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No roles found.</div>
              );
          }
        })()}
      </div>
    </Container>
  );
};

export default RolesPage;
