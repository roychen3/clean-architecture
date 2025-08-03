import { cn } from '@/lib/utils';

export type FormErrorMessageProps = React.ComponentProps<'p'> & {
  value?: React.ReactNode;
};
export const FormErrorMessage = ({
  className,
  ...props
}: FormErrorMessageProps) => {
  return (
    <p className={cn('mt-1 text-xs text-red-600', className)} {...props} />
  );
};
