import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['articles', 'create'];

export function useCreateArticle() {
  const articlesApi = useMemo(() => APIServiceFactory.createArticlesAPI(), []);
  const create = articlesApi.create.bind(articlesApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: create,
  });
  return mutation;
}
