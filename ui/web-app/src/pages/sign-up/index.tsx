import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';

import { routerPathConfig } from '@/consts/routerPaths';

import { useAuthRegister } from '@/hooks/auth/use-auth-register';

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
import { CenterFormContainer } from '@/components/container';
import { TypographyH3 } from '@/components/typography';

const SignUpSchema = z
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

type SignUpFormValues = z.infer<typeof SignUpSchema>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: register, error: registerError } = useAuthRegister();

  const form = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await register({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
      navigate(routerPathConfig.home.pathname);
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message:
          registerError?.message ||
          (error instanceof Error ? error.message : 'Sign up failed'),
      });
    }
  };

  return (
    <CenterFormContainer>
      <div className="w-full space-y-4">
        <TypographyH3 className="text-center">Sign Up</TypographyH3>
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Form>
        </FormProvider>
      </div>
    </CenterFormContainer>
  );
};

export default SignUpPage;
