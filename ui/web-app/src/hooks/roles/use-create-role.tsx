import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const createRoleMutationKey = ['roles', 'create'];

export function useCreateRole() {
  const rolesApi = useMemo(() => APIServiceFactory.createRolesAPI(), []);
  const create = rolesApi.create.bind(rolesApi);

  const mutation = useMutation({
    mutationKey: createRoleMutationKey,
    mutationFn: create,
  });
  return mutation;
}
