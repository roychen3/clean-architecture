import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['users', 'register'];

export function useCreateUser() {
  const usersApi = useMemo(() => APIServiceFactory.createUsersAPI(), []);
  const create = usersApi.create.bind(usersApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: create,
  });
  return mutation;
}
