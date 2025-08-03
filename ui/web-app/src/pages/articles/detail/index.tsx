import { useParams, useNavigate } from 'react-router';

import { routerPathConfig } from '@/consts/routerPaths';

import { useArticle } from '@/hooks/articles/use-article';

import { Skeleton } from '@/components/ui/skeleton';

import { ArticleOptions } from '../_components/article-item-menu';
import { Container } from '@/components/container';

const ArticleDetailPage = () => {
  const navigate = useNavigate();
  const { articleId } = useParams<{ articleId: string }>();
  const { data, status, error } = useArticle({
    path: {
      id: articleId || '',
    },
  });
  const article = data?.data;

  const handleDeleteSuccess = () => {
    const searchParams = new URLSearchParams({
      'article-id': articleId || '',
    });
    navigate({
      pathname: routerPathConfig.articles.pathname,
      search: '?' + searchParams.toString(),
    });
  };

  if (status === 'pending') {
    return (
      <Container>
        <article className="space-y-4">
          <Skeleton className="h-[36px] w-2/3" />

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Skeleton className="h-[20px] w-20" />
              <span>·</span>
              <Skeleton className="h-[20px] w-24" />
            </div>
            <Skeleton className="h-[36px] w-[36px]" />
          </div>

          <Skeleton className="h-64 w-full" />

          <div className="flex justify-end">
            <Skeleton className="h-[36px] w-[36px]" />
          </div>
        </article>
      </Container>
    );
  }

  if (articleId === undefined || status === 'error') {
    return (
      <Container>
        <div className="text-destructive">{String(error)}</div>
      </Container>
    );
  }

  if (!article) return null;

  return (
    <Container>
      <article className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">{article.title}</h1>

        <div className="flex justify-between items-center">
          <div className="flex text-sm text-muted-foreground gap-2">
            <span>{article.authorName}</span>
            <span>·</span>
            <span>{article.createdAt}</span>
          </div>
          <ArticleOptions articleId={article.id} />
        </div>

        <div
          className="prose prose-neutral w-full max-w-full text-base"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        <div className="flex justify-end">
          <ArticleOptions
            articleId={article.id}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      </article>
    </Container>
  );
};

export default ArticleDetailPage;
