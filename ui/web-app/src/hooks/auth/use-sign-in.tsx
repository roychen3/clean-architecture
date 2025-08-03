import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';
import { authStore } from '@/store/auth-store';
import { rolePermissionsStore } from '@/store/role-permissions-store';
import { jwtDecode } from '@/lib/jwt';

export const mutationKey = ['auth', 'signIn'];

export function useSignIn() {
  const authApi = useMemo(() => APIServiceFactory.createAuthAPI(), []);
  const signIn = authApi.signIn.bind(authApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: signIn,
    onSuccess: (response) => {
      authStore.setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      rolePermissionsStore.setUserPermissions(decoded.userPermissions);
    },
  });
  return mutation;
}
