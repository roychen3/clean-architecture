import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['users', 'update'];

export function useUpdateUser() {
  const usersApi = useMemo(() => APIServiceFactory.createUsersAPI(), []);
  const update = usersApi.update.bind(usersApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: update,
  });
  return mutation;
}
