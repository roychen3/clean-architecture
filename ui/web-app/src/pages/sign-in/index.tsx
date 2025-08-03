import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';

import { routerPathConfig } from '@/consts/routerPaths';

import { useSignIn } from '@/hooks/auth/use-sign-in';

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

const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormValues = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: signIn, status, error: signInError } = useSignIn();
  const signInPending = status === 'pending';

  const form = useForm<SignInFormValues>({
    resolver: standardSchemaResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await signIn({ body: data });
      navigate(routerPathConfig.home.pathname);
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message:
          signInError?.message ||
          (error instanceof Error ? error.message : 'Sign in failed'),
      });
    }
  };

  return (
    <CenterFormContainer>
      <div className="w-full space-y-4">
        <TypographyH3 className="text-center">Sign In</TypographyH3>
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
                      disabled={signInPending}
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
                      autoComplete="current-password"
                      {...field}
                      disabled={signInPending}
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
            <Button type="submit" className="w-full" disabled={signInPending}>
              {signInPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form>
        </FormProvider>
      </div>
    </CenterFormContainer>
  );
};

export default SignInPage;
