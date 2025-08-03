import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const queryKey = ['me'];

export function useMe(enabled = true) {
  const meApi = useMemo(() => APIServiceFactory.createMeAPI(), []);
  const getMe = meApi.getMe.bind(meApi);

  const query = useQuery({
    queryKey,
    queryFn: getMe,
    enabled,
  });
  return query;
}
