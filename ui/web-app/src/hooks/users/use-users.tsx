import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const queryKey = ['users', 'all'];

export function useUsers() {
  const usersApi = useMemo(() => APIServiceFactory.createUsersAPI(), []);
  const getAll = usersApi.getAll.bind(usersApi);

  const query = useQuery({
    queryKey,
    queryFn: getAll,
  });
  return query;
}
