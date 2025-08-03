import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { GetUserRolesRequestDTO } from '@/api/role-permissions/dto';
import { APIServiceFactory } from '@/api/factory';

export const queryKey = (req: GetUserRolesRequestDTO) => [
  'permissions',
  'user-roles',
  req,
];

export function useUserRoles(req: GetUserRolesRequestDTO, enabled = true) {
  const api = useMemo(() => APIServiceFactory.createRolePermissionsAPI(), []);
  const getUserRoles = api.getUserRoles.bind(api);

  const query = useQuery({
    queryKey: queryKey(req),
    queryFn: () => getUserRoles(req),
    enabled: !!req.path.userId && enabled,
  });
  return query;
}
