import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['me', 'change-password'];

export function useChangeMePassword() {
  const meApi = useMemo(() => APIServiceFactory.createMeAPI(), []);
  const changePassword = meApi.changePassword.bind(meApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: changePassword,
  });
  return mutation;
}
