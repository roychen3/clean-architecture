import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { GetArticleRequestDTO } from '@/api/articles/dto';
import { APIServiceFactory } from '@/api/factory';

export const queryKey = (req: GetArticleRequestDTO) => [
  'articles',
  JSON.stringify(req),
];

export function useArticle(req: GetArticleRequestDTO, enabled = true) {
  const articlesApi = useMemo(() => APIServiceFactory.createArticlesAPI(), []);
  const getOne = articlesApi.getOne.bind(articlesApi);

  const query = useQuery({
    queryKey: queryKey(req),
    queryFn: () => getOne(req),
    enabled: !!req.path.id && enabled,
  });
  return query;
}
