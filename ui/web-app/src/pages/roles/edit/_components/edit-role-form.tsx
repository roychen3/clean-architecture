import { useRole } from '@/hooks/roles/use-role';
import { useUpdateRole } from '@/hooks/roles/use-update-role';

import { FormEditTitle } from '@/components/typography';

import { RoleFormSkeleton } from '../../_components/role-form-skeleton';
import { RoleForm, type RoleFormValues } from '../../_components/role-form';

interface EditRoleFormProps {
  roleId: string;
}

export function EditRoleForm({ roleId }: EditRoleFormProps) {
  const { data, status, error, refetch } = useRole({
    path: {
      id: roleId,
    },
  });
  const role = data?.data;
  const { mutateAsync: update } = useUpdateRole();

  const onSubmit = async (data: RoleFormValues) => {
    await update({
      path: {
        id: roleId,
      },
      body: {
        name: data.name,
        priority: data.priority,
      },
    });
    refetch();
  };

  return (
    <div className="space-y-4">
      <FormEditTitle>Edit Role</FormEditTitle>

      {(() => {
        switch (status) {
          case 'pending':
            return <RoleFormSkeleton />;

          case 'error':
            return <div className="text-destructive">{String(error)}</div>;

          case 'success':
          default:
            return (
              <RoleForm
                initialValues={{
                  name: role?.name || '',
                  priority:
                    typeof role?.priority === 'number' ? role.priority : 0,
                }}
                onSubmit={onSubmit}
                submitLabel="Save"
              />
            );
        }
      })()}
    </div>
  );
}
