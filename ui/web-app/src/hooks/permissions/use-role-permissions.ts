import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { GetRolePermissionRequestDTO } from '@/api/role-permissions/dto';
import { APIServiceFactory } from '@/api/factory';

export const queryKey = (req: GetRolePermissionRequestDTO) => [
  'role-permissions',
  'role-permission',
  JSON.stringify(req),
];

export function useRolePermissions(
  req: GetRolePermissionRequestDTO,
  enabled = true,
) {
  const api = useMemo(() => APIServiceFactory.createRolePermissionsAPI(), []);
  const getRolePermissions = api.getRolePermissions.bind(api);

  const query = useQuery({
    queryKey: queryKey(req),
    queryFn: () => getRolePermissions(req),
    enabled: !!req.path.id && enabled,
  });
  return query;
}
