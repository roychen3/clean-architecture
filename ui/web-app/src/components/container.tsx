import { cn } from '@/lib/utils';

export type ContainerProps = React.ComponentProps<'div'>;
export const Container: React.FC<ContainerProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('container mx-auto px-1 py-4 w-full max-w-2xl', className)}
      {...props}
    />
  );
};

export type CenterFormContainerProps = React.ComponentProps<'div'>;
export const CenterFormContainer: React.FC<ContainerProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'container mx-auto px-1 w-full max-w-md flex items-center justify-center',
        className,
      )}
      {...props}
    />
  );
};
