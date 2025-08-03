import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { GetRoleRequestDTO } from '@/api/roles/dto';
import { APIServiceFactory } from '@/api/factory';

export const roleQueryKey = (req: GetRoleRequestDTO) => [
  'roles',
  JSON.stringify(req),
];

export function useRole(req: GetRoleRequestDTO, enabled = true) {
  const rolesApi = useMemo(() => APIServiceFactory.createRolesAPI(), []);
  const getOne = rolesApi.getOne.bind(rolesApi);

  const query = useQuery({
    queryKey: roleQueryKey(req),
    queryFn: () => getOne(req),
    enabled: !!req.path.id && enabled,
  });
  return query;
}
