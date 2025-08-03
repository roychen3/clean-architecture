import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { GetArticlesRequestDTO } from '@/api/articles/dto';
import { APIServiceFactory } from '@/api/factory';

export const queryKey = (query?: GetArticlesRequestDTO['query']) => [
  'articles',
  JSON.stringify(query),
];

export function useArticles(req?: GetArticlesRequestDTO, enabled = true) {
  const articlesApi = useMemo(() => APIServiceFactory.createArticlesAPI(), []);
  const getAuthorArticles = articlesApi.getMany.bind(articlesApi);

  const query = useQuery({
    queryKey: queryKey(req?.query),
    queryFn: () => getAuthorArticles(req),
    enabled: enabled,
  });
  return query;
}
