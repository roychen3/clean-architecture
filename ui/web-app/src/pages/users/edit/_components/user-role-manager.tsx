import { useEffect, useMemo, useState } from 'react';

import { useRoles } from '@/hooks/roles/use-roles';
import { useUserRoles } from '@/hooks/permissions/use-user-roles';
import { useSetUserRoles } from '@/hooks/permissions/use-set-user-roles';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FormEditTitle } from '@/components/typography';
import { useGlobalUnsaveLeaveBlocker } from '@/components/unsave-leave-blocker-provider';

interface UserRoleManagerProps {
  userId: string;
}

export const UserRoleManager = ({ userId }: UserRoleManagerProps) => {
  const {
    data: rolesData,
    status: rolesStatus,
    error: rolesError,
  } = useRoles();
  const roles = rolesData?.data || [];
  const {
    data: userRoles,
    status: userRolesStatus,
    error: userRolesError,
    refetch: refetchPermissions,
  } = useUserRoles({ path: { userId } });
  const {
    mutateAsync: setUserRoles,
    status: setRolesStatus,
    error: setRolesError,
  } = useSetUserRoles();

  const isRoleLoading =
    rolesStatus === 'pending' || userRolesStatus === 'pending';
  const isRoleMutating = setRolesStatus === 'pending';

  const userRoleIds = useMemo(
    () =>
      Array.isArray(userRoles?.data) ? userRoles.data.map((rp) => rp.id) : [],
    [userRoles?.data],
  );
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(userRoleIds);

  const isDirty = useMemo(
    () => selectedRoleIds.join(',') !== userRoleIds.join(','),
    [selectedRoleIds, userRoleIds],
  );

  const { setIsDirty } = useGlobalUnsaveLeaveBlocker();
  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  useEffect(() => {
    setSelectedRoleIds(userRoleIds);
  }, [userRoleIds]);

  const handleRoleCheckChange = (roleId: string, checked: boolean) => {
    setSelectedRoleIds((prev) =>
      checked ? [...prev, roleId] : prev.filter((id) => id !== roleId),
    );
  };

  const handleSaveRoles = async () => {
    try {
      setIsDirty(false);
      await setUserRoles({ body: { userId, roleIds: selectedRoleIds } });
      refetchPermissions();
    } catch {
      setIsDirty(true);
    }
  };

  return (
    <div className="space-y-4">
      <FormEditTitle>Role Management</FormEditTitle>

      {isRoleLoading && (
        <div className="space-y-3">
          <ul className="space-y-2">
            {[...Array(3)].map((_, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-5 w-32" />
              </li>
            ))}
          </ul>
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      )}
      {rolesError && (
        <div className="text-destructive">
          {rolesError instanceof Error
            ? rolesError.message
            : 'Failed to load roles'}
        </div>
      )}
      {userRolesError && (
        <div className="text-destructive">
          {userRolesError instanceof Error
            ? userRolesError.message
            : 'Failed to load permissions'}
        </div>
      )}
      {!isRoleLoading && roles && (
        <div className="space-y-3">
          <ul className="space-y-2">
            {roles.map((role: { id: string; name: string }) => (
              <li key={role.id} className="flex items-center gap-2">
                <input
                  id={`role-${role.id}`}
                  type="checkbox"
                  className="accent-primary h-4 w-4"
                  checked={selectedRoleIds.includes(role.id)}
                  disabled={isRoleMutating}
                  onChange={(e) =>
                    handleRoleCheckChange(role.id, e.target.checked)
                  }
                />
                <label
                  htmlFor={`role-${role.id}`}
                  className="text-base select-none"
                >
                  {role.name}
                </label>
              </li>
            ))}
          </ul>
          {setRolesError && (
            <div className="text-destructive">
              {setRolesError instanceof Error
                ? setRolesError.message
                : 'Save failed'}
            </div>
          )}
          <Button
            size="sm"
            onClick={handleSaveRoles}
            disabled={isRoleMutating || !isDirty}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
