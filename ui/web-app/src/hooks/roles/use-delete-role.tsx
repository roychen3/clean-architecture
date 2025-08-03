import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const deleteRoleMutationKey = ['roles', 'delete'];

export function useDeleteRole() {
  const rolesApi = useMemo(() => APIServiceFactory.createRolesAPI(), []);
  const deleteRole = rolesApi.delete.bind(rolesApi);

  const mutation = useMutation({
    mutationKey: deleteRoleMutationKey,
    mutationFn: deleteRole,
  });
  return mutation;
}
