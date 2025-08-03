import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const queryKey = ['role-permissions', 'actions'];

export function useRolePermissionActions(enabled = true) {
  const api = useMemo(() => APIServiceFactory.createRolePermissionsAPI(), []);
  const getActions = api.getActions.bind(api);

  const query = useQuery({
    queryKey,
    queryFn: getActions,
    enabled,
  });
  return query;
}
