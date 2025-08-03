import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['me', 'update'];

export function useUpdateMe() {
  const meApi = useMemo(() => APIServiceFactory.createMeAPI(), []);
  const updateMe = meApi.updateMe.bind(meApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: updateMe,
  });
  return mutation;
}
