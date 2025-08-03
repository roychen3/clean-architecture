import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['role-permissions', 'set-user-roles'];

export function useSetUserRoles() {
  const api = useMemo(() => APIServiceFactory.createRolePermissionsAPI(), []);
  const setUserRoles = api.setUserRoles.bind(api);

  const mutation = useMutation({
    mutationKey,
    mutationFn: setUserRoles,
  });
  return mutation;
}
