import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { GetUserRequestDTO } from '@/api/users/dto';
import { APIServiceFactory } from '@/api/factory';

export const queryKey = (req: GetUserRequestDTO) => [
  'users',
  JSON.stringify(req),
];

export function useUser(req: GetUserRequestDTO, enabled = true) {
  const usersApi = useMemo(() => APIServiceFactory.createUsersAPI(), []);
  const getOne = usersApi.getOne.bind(usersApi);

  const query = useQuery({
    queryKey: queryKey(req),
    queryFn: () => getOne(req),
    enabled: !!req.path.id && enabled,
  });
  return query;
}
