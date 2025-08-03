import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';

import { queryKey as meQueryKey } from '@/hooks/me/use-me';
import { useUpdateMe } from '@/hooks/me/use-update-me';

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

import { Form } from '@/components/form/form';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { FormEditTitle } from '@/components/typography';
import { useGlobalUnsaveLeaveBlocker } from '@/components/unsave-leave-blocker-provider';

const ProfileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

interface ProfileFormProps {
  email: string;
  name: string;
}

export function ProfileForm({ email, name }: ProfileFormProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateMe, status, error: updateError } = useUpdateMe();

  const form = useForm<ProfileFormValues>({
    resolver: standardSchemaResolver(ProfileFormSchema),
    defaultValues: { name },
  });

  const { setIsDirty } = useGlobalUnsaveLeaveBlocker();
  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [form.formState.isDirty, setIsDirty]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsDirty(false);
      await updateMe({ body: values });
      form.reset(values);
      await queryClient.invalidateQueries({
        queryKey: meQueryKey,
      });
    } catch (error) {
      setIsDirty(true);
      form.setError('root', {
        type: 'manual',
        message:
          updateError?.message ||
          (error instanceof Error ? error.message : 'Update failed'),
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <FormEditTitle>Edit Profile</FormEditTitle>
      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input value={email} readOnly disabled className="bg-muted" />
            </FormControl>
          </FormItem>
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
                    disabled={
                      status === 'pending' || form.formState.isSubmitting
                    }
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
              status === 'pending' ||
              form.formState.isSubmitting ||
              !form.formState.isDirty
            }
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Form>
      </FormProvider>
    </div>
  );
}
