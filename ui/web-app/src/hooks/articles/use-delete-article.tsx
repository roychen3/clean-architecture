import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { APIServiceFactory } from '@/api/factory';

export const mutationKey = ['articles', 'delete'];

export function useDeleteArticle() {
  const articlesApi = useMemo(() => APIServiceFactory.createArticlesAPI(), []);
  const deleteArticle = articlesApi.delete.bind(articlesApi);

  const mutation = useMutation({
    mutationKey,
    mutationFn: deleteArticle,
  });
  return mutation;
}
