import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form as FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Form } from '@/components/form/form';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { useGlobalUnsaveLeaveBlocker } from '@/components/unsave-leave-blocker-provider';

const ArticleFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export type ArticleFormValues = z.infer<typeof ArticleFormSchema>;

interface ArticleFormProps {
  initialValues?: ArticleFormValues;
  onSubmit: (values: ArticleFormValues) => void;
  submitLabel?: string;
  pending?: boolean;
  error?: Error | null;
}

export const ArticleForm = ({
  initialValues = { title: '', content: '' },
  onSubmit,
  submitLabel = 'Submit',
  pending = false,
  error: propError = null,
}: ArticleFormProps) => {
  const form = useForm<ArticleFormValues>({
    resolver: standardSchemaResolver(ArticleFormSchema),
    defaultValues: initialValues,
  });

  const { setIsDirty } = useGlobalUnsaveLeaveBlocker();
  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [form.formState.isDirty, setIsDirty]);

  const handleSubmit = async (values: ArticleFormValues) => {
    if (pending) return;
    try {
      setIsDirty(false);
      await onSubmit(values);
      form.reset(values);
    } catch (error) {
      setIsDirty(true);
      form.setError('root', {
        type: 'manual',
        message:
          propError?.message ||
          (error instanceof Error ? error.message : 'Submit failed'),
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="off"
                  {...field}
                  disabled={pending || form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  autoComplete="off"
                  {...field}
                  disabled={pending || form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(form.formState.errors.root || propError) && (
          <FormErrorMessage>
            {form.formState.errors.root?.message || propError?.message}
          </FormErrorMessage>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={
            pending || form.formState.isSubmitting || !form.formState.isDirty
          }
        >
          {pending || form.formState.isSubmitting
            ? 'Submitting...'
            : submitLabel}
        </Button>
      </Form>
    </FormProvider>
  );
};
