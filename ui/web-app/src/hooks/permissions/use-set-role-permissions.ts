import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['role-permissions', 'set-role-permission'];

export function useSetRolePermissions() {
  const api = useMemo(() => APIServiceFactory.createRolePermissionsAPI(), []);
  const setRolePermissions = api.setRolePermissions.bind(api);

  const mutation = useMutation({
    mutationKey,
    mutationFn: setRolePermissions,
  });
  return mutation;
}
