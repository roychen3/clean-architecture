import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';

import { routerPathConfig } from '@/consts/routerPaths';

import { useDeleteMe } from '@/hooks/me/use-delete-me';

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

const DangerZoneSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type DangerZoneFormValues = z.infer<typeof DangerZoneSchema>;

export function DangerZone() {
  const { mutateAsync: deleteMe, status, error } = useDeleteMe();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const form = useForm<DangerZoneFormValues>({
    resolver: standardSchemaResolver(DangerZoneSchema),
    defaultValues: {
      password: '',
    },
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset();
  };

  const handleDelete = async (data: DangerZoneFormValues) => {
    try {
      await deleteMe({ body: { password: data.password } });
      closeDialog();
      navigate(routerPathConfig.signIn.pathname);
    } catch (err) {
      form.setError('root', {
        type: 'manual',
        message:
          error?.message ||
          (err instanceof Error ? err.message : 'Delete failed'),
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <FormEditTitle className="text-destructive">
          Delete Account
        </FormEditTitle>
        <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
          Delete Your Account
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
        <DialogContent>
          <FormProvider {...form}>
            <Form
              onSubmit={form.handleSubmit(handleDelete)}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>Confirm Delete Account</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={form.formState.isSubmitting || status === 'pending'}
                >
                  {form.formState.isSubmitting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </Form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
