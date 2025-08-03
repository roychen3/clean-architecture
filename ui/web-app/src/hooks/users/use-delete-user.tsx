import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['users', 'delete'];

export function useDeleteUser() {
  const usersApi = useMemo(() => APIServiceFactory.createUsersAPI(), []);
  const deleteUser = usersApi.delete.bind(usersApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: deleteUser,
  });
  return mutation;
}
