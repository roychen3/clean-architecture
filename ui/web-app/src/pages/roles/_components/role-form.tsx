import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';

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
import { useGlobalUnsaveLeaveBlocker } from '@/components/unsave-leave-blocker-provider';
import { useEffect } from 'react';

export const RoleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  priority: z.number().min(0, 'Priority must be at least 0'),
});

export type RoleFormValues = z.infer<typeof RoleFormSchema>;

interface RoleFormProps {
  initialValues?: RoleFormValues;
  onSubmit: (values: RoleFormValues) => void;
  submitLabel?: string;
  pending?: boolean;
}

export function RoleForm({
  initialValues = { name: '', priority: 0 },
  onSubmit,
  submitLabel,
}: RoleFormProps) {
  const form = useForm<RoleFormValues>({
    resolver: standardSchemaResolver(RoleFormSchema),
    defaultValues: initialValues,
  });

  const { setIsDirty } = useGlobalUnsaveLeaveBlocker();
  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [form.formState.isDirty, setIsDirty]);

  const handleSubmit = async (values: RoleFormValues) => {
    try {
      setIsDirty(false);
      await onSubmit(values);
      form.reset(values);
    } catch (error) {
      setIsDirty(true);
      form.setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Update failed',
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="off"
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
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          {form.formState.isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </Form>
    </FormProvider>
  );
}
