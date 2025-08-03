import { useCallback } from 'react';
import { useNavigate, generatePath, useParams } from 'react-router';

import { routerPathConfig } from '@/consts/routerPaths';

import { useArticle } from '@/hooks/articles/use-article';
import { useUpdateArticle } from '@/hooks/articles/use-update-article';

import { Container } from '@/components/container';
import { FormEditTitle } from '@/components/typography';

import {
  ArticleForm,
  type ArticleFormValues,
} from '../_components/article-form';
import { ArticleFormSkeleton } from '../_components/article-form-skeleton';

const ArticleEditPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { data, status, error } = useArticle({
    path: {
      id: articleId || '',
    },
  });
  const {
    mutateAsync: update,
    status: updateStatus,
    error: updateError,
  } = useUpdateArticle();
  const article = data?.data;
  const isLoading = status === 'pending';
  const isSubmitting = updateStatus === 'pending';

  const handleSubmit = useCallback(
    async (values: ArticleFormValues) => {
      if (!articleId) return;
      try {
        await update({
          path: {
            id: articleId,
          },
          body: {
            title: values.title,
            body: values.content,
          },
        });
        navigate(
          generatePath(routerPathConfig.articlesDetail.pathname, { articleId }),
        );
      } catch {
        return;
      }
    },
    [articleId, update, navigate],
  );

  if (error)
    return <Container className="text-red-500">{String(error)}</Container>;
  if (!article) return <Container>Article not found.</Container>;

  return (
    <Container className="space-y-4">
      <FormEditTitle>Edit Article</FormEditTitle>
      {isLoading ? (
        <ArticleFormSkeleton />
      ) : (
        <ArticleForm
          initialValues={{ title: article.title, content: article.body }}
          onSubmit={handleSubmit}
          submitLabel="Update"
          pending={isSubmitting}
          error={updateError}
        />
      )}
    </Container>
  );
};

export default ArticleEditPage;
