import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const updateRoleMutationKey = ['roles', 'update'];

export function useUpdateRole() {
  const rolesApi = useMemo(() => APIServiceFactory.createRolesAPI(), []);
  const update = rolesApi.update.bind(rolesApi);

  const mutation = useMutation({
    mutationKey: updateRoleMutationKey,
    mutationFn: update,
  });
  return mutation;
}
