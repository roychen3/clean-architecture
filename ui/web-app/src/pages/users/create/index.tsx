import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { useNavigate } from 'react-router';

import { routerPathConfig } from '@/consts/routerPaths';

import { useCreateUser } from '@/hooks/users/use-create-user';

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

import { Container } from '@/components/container';
import { Form } from '@/components/form/form';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { FormEditTitle } from '@/components/typography';
import { useGlobalUnsaveLeaveBlocker } from '@/components/unsave-leave-blocker-provider';

const CreateUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email(),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type CreateUserFormValues = z.infer<typeof CreateUserSchema>;

const UsersCreatePage = () => {
  const navigate = useNavigate();
  const { mutateAsync: create, error: createUserError } = useCreateUser();

  const form = useForm<CreateUserFormValues>({
    resolver: standardSchemaResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { setIsDirty } = useGlobalUnsaveLeaveBlocker();
  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [form.formState.isDirty, setIsDirty]);

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      setIsDirty(false);
      await create({
        body: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      });
      form.reset(values);
      navigate(routerPathConfig.users.pathname);
    } catch (error) {
      setIsDirty(true);
      form.setError('root', {
        type: 'manual',
        message:
          createUserError?.message ||
          (error instanceof Error ? error.message : 'Create user failed'),
      });
    }
  };

  return (
    <Container className="space-y-4">
      <FormEditTitle>Create User</FormEditTitle>
      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
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
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
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
            className="w-full"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </Form>
      </FormProvider>
    </Container>
  );
};

export default UsersCreatePage;
