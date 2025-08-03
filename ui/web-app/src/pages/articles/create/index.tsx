import { useCallback } from 'react';
import { useNavigate, generatePath } from 'react-router';

import { routerPathConfig } from '@/consts/routerPaths';

import { useCreateArticle } from '@/hooks/articles/use-create-article';

import { Container } from '@/components/container';
import { FormEditTitle } from '@/components/typography';

import { ArticleForm } from '../_components/article-form';

const ArticleCreatePage = () => {
  const navigate = useNavigate();
  const { mutateAsync: create, status, error } = useCreateArticle();
  const isSubmitting = status === 'pending';

  const handleSubmit = useCallback(
    async (values: { title: string; content: string }) => {
      const response = await create({
        body: {
          title: values.title,
          body: values.content,
        },
      });
      const article = response.data;
      navigate(
        generatePath(routerPathConfig.articlesDetail.pathname, {
          articleId: article.id,
        }),
      );
    },
    [create, navigate],
  );

  return (
    <Container className="space-y-4">
      <FormEditTitle>Create Article</FormEditTitle>
      <ArticleForm
        onSubmit={handleSubmit}
        submitLabel="Submit"
        pending={isSubmitting}
        error={error}
      />
    </Container>
  );
};

export default ArticleCreatePage;
