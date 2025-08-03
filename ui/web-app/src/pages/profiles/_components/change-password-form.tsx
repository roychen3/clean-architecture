import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';

import { useChangeMePassword } from '@/hooks/me/use-cheange-me-password';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(1, 'New password is required'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match.',
    path: ['confirmNewPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;

export function ChangePasswordForm() {
  const { mutateAsync: changePassword, status } = useChangeMePassword();
  const [open, setOpen] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: standardSchemaResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword({
        body: {
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });
      closeDialog();
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message:
          error instanceof Error ? error.message : 'Failed to change password',
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <FormEditTitle>Change Password</FormEditTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          Change Password
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (open) {
            setOpen(open);
          } else {
            closeDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                        disabled={
                          form.formState.isSubmitting || status === 'pending'
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                        disabled={
                          form.formState.isSubmitting || status === 'pending'
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                        disabled={
                          form.formState.isSubmitting || status === 'pending'
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
              <DialogFooter>
                <Button
                  type="submit"
                  size="sm"
                  disabled={form.formState.isSubmitting || status === 'pending'}
                >
                  {form.formState.isSubmitting
                    ? 'Changing...'
                    : 'Change Password'}
                </Button>
              </DialogFooter>
            </Form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
