import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { jwtDecode } from '@/lib/jwt';

import { APIServiceFactory } from '@/api/factory';

import { authStore } from '@/store/auth-store';
import { rolePermissionsStore } from '@/store/role-permissions-store';

export const mutationKey = ['auth', 'register'];

export function useAuthRegister() {
  const authApi = useMemo(() => APIServiceFactory.createAuthAPI(), []);
  const register = authApi.register.bind(authApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: register,
    onSuccess: (response) => {
      authStore.setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      rolePermissionsStore.setUserPermissions(decoded.userPermissions);
    },
  });
  return mutation;
}
