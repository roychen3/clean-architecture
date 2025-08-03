import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';
import { authStore } from '@/store/auth-store';

export const mutationKey = ['auth', 'signOut'];

export function useSignOut() {
  const authApi = useMemo(() => APIServiceFactory.createAuthAPI(), []);
  const singOut = authApi.singOut.bind(authApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: singOut,
    onSettled: () => {
      authStore.setAccessToken(null);
    },
  });
  return mutation;
}
