import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';
import { authStore } from '@/store/auth-store';

export const mutationKey = ['me', 'delete'];

export function useDeleteMe() {
  const meApi = useMemo(() => APIServiceFactory.createMeAPI(), []);
  const deleteMe = meApi.deleteMe.bind(meApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: deleteMe,
    onSuccess: () => {
      authStore.setAccessToken(null);
    },
  });
  return mutation;
}
