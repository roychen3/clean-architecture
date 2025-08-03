import { cn } from '@/lib/utils';

export type FormProps = React.ComponentProps<'form'> & {};
export const Form = ({ className, ...props }: FormProps) => {
  return <form className={cn('space-y-4', className)} {...props} />;
};
