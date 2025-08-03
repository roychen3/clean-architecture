import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const queryKey = ['role-permissions', 'resources'];

export function useRolePermissionResources(enabled = true) {
  const api = useMemo(() => APIServiceFactory.createRolePermissionsAPI(), []);
  const getResources = api.getResources.bind(api);

  const query = useQuery({
    queryKey,
    queryFn: getResources,
    enabled,
  });
  return query;
}
