import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['articles', 'update'];

export function useUpdateArticle() {
  const articlesApi = useMemo(() => APIServiceFactory.createArticlesAPI(), []);
  const update = articlesApi.update.bind(articlesApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: update,
  });
  return mutation;
}
