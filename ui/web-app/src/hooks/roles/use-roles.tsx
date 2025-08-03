import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const rolesQueryKey = ['roles', 'all'];

export function useRoles() {
  const rolesApi = useMemo(() => APIServiceFactory.createRolesAPI(), []);
  const getRoles = rolesApi.getRoles.bind(rolesApi);

  const query = useQuery({
    queryKey: rolesQueryKey,
    queryFn: getRoles,
  });
  return query;
}
