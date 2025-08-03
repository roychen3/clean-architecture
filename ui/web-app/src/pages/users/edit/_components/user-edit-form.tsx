import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';

import { useUser } from '@/hooks/users/use-user';
import { useUpdateUser } from '@/hooks/users/use-update-user';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form as FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

import { Form } from '@/components/form/form';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { FormEditTitle } from '@/components/typography';
import { useGlobalUnsaveLeaveBlocker } from '@/components/unsave-leave-blocker-provider';

const UserEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type UserEditFormValues = z.infer<typeof UserEditSchema>;

interface UserEditFormProps {
  userId: string;
}

export const UserEditForm = ({ userId }: UserEditFormProps) => {
  const { data, status, error } = useUser({
    path: {
      id: userId,
    },
  });
  const user = data?.data;
  const { mutateAsync: update, error: updateError } = useUpdateUser();

  const form = useForm<UserEditFormValues>({
    resolver: standardSchemaResolver(UserEditSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
    values: user ? { name: user.name, email: user.email } : undefined,
  });

  const { setIsDirty } = useGlobalUnsaveLeaveBlocker();
  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [form.formState.isDirty, setIsDirty]);

  const onSubmit = async (values: UserEditFormValues) => {
    try {
      setIsDirty(false);
      await update({
        path: {
          id: userId,
        },
        body: {
          name: values.name,
        },
      });
      form.reset(values);
    } catch (err) {
      setIsDirty(true);
      form.setError('root', {
        type: 'manual',
        message:
          updateError?.message ||
          (err instanceof Error ? err.message : 'Update failed'),
      });
    }
  };

  return (
    <div className="space-y-4">
      <FormEditTitle> Edit User</FormEditTitle>
      {(() => {
        switch (status) {
          case 'pending':
            return (
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-8 w-20 mt-4" />
              </div>
            );

          case 'error':
            return (
              <div className="text-destructive">
                {error instanceof Error ? error.message : 'Load failed'}
              </div>
            );

          case 'success':
          default:
            return data ? (
              <FormProvider {...form}>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            {...field}
                            readOnly
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            autoComplete="name"
                            {...field}
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.root && (
                    <FormErrorMessage>
                      {form.formState.errors.root.message}
                    </FormErrorMessage>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    disabled={
                      form.formState.isSubmitting || !form.formState.isDirty
                    }
                  >
                    {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </Form>
              </FormProvider>
            ) : (
              <div className="text-muted-foreground">User not found</div>
            );
        }
      })()}
    </div>
  );
};
