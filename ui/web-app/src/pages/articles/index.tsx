import { generatePath, useSearchParams, useNavigate } from 'react-router';
import { useStore } from '@tanstack/react-store';
import { Plus } from 'lucide-react';

import { routerPathConfig } from '@/consts/routerPaths';

import { authStore } from '@/store/auth-store';

import { useArticles } from '@/hooks/articles/use-articles';
import { useMe } from '@/hooks/me/use-me';

import { Container } from '@/components/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { ArticleOptions } from './_components/article-item-menu';
import { TypographyH2 } from '@/components/typography';

const ArticleListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAuthenticated = useStore(authStore, (state) => state.isAuthenticated);

  const me = useMe(isAuthenticated);

  const page = searchParams.get('page');
  const pageSize = searchParams.get('page-size');
  const title = searchParams.get('title') || undefined;
  const authorId = searchParams.get('author-id') || undefined;
  const sortBy = searchParams.get('sort-by') as
    | 'createdAt'
    | 'updatedAt'
    | undefined;
  const sortOrder = searchParams.get('sort-order') as
    | 'asc'
    | 'desc'
    | undefined;

  const query = {
    page: page ? Number(page) : 0,
    pageSize: pageSize ? Number(pageSize) : 50,
    title,
    authorId,
    sortBy,
    sortOrder,
  };

  const { data, status, error, refetch } = useArticles({
    query,
  });

  const articles = data?.data ?? [];
  const currentAuthorId = me.data?.data.id || '';

  const handleCreateArticle = () => {
    if (!currentAuthorId) {
      return;
    }
    navigate(
      generatePath(routerPathConfig.articlesCreate.pathname, {
        authorId: currentAuthorId,
      }),
    );
  };
  const handleCardClick = (articleId: string) => {
    navigate(
      generatePath(routerPathConfig.articlesDetail.pathname, {
        articleId,
      }),
    );
  };
  const handleDeleteSuccess = () => {
    refetch();
  };

  return (
    <Container className="space-y-4">
      <div className="flex justify-between items-center">
        <TypographyH2>Articles</TypographyH2>
        {isAuthenticated ? (
          <Button onClick={handleCreateArticle} variant="outline" size="sm">
            <Plus />
          </Button>
        ) : null}
      </div>
      <Separator />
      <div className="flex flex-col gap-6">
        {(() => {
          switch (status) {
            case 'pending':
              return (
                <>
                  {[...Array(3)].map((_, idx) => (
                    <Card key={idx} className="w-full">
                      <CardHeader>
                        <CardTitle>
                          <Skeleton className="h-6 w-1/3" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              );

            case 'error':
              return (
                <Container className="text-destructive">
                  載入失敗：{String(error)}
                </Container>
              );

            case 'success':
            default:
              return articles.map((article) => (
                <Card
                  key={article.id}
                  className="w-full"
                  onClick={() => handleCardClick(article.id)}
                >
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.body}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground">
                          By {article.authorName} &middot; {article.createdAt}
                        </div>
                        <ArticleOptions
                          articleId={article.id}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ));
          }
        })()}
      </div>
    </Container>
  );
};

export default ArticleListPage;
