import { cn } from '@/lib/utils';

export type TypographyH1Props = React.ComponentProps<'h1'>;
export function TypographyH1({ className, ...props }: TypographyH1Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
        className,
      )}
      {...props}
    />
  );
}

export type TypographyH2Props = React.ComponentProps<'h2'>;
export function TypographyH2({ className, ...props }: TypographyH2Props) {
  return (
    <h2
      className={cn(
        'scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  );
}

export type TypographyH3Props = React.ComponentProps<'h3'>;
export function TypographyH3({ className, ...props }: TypographyH3Props) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

export type TypographyH4Props = React.ComponentProps<'h4'>;
export function TypographyH4({ className, ...props }: TypographyH4Props) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

export type FormEditTitleProps = React.ComponentProps<'h4'>;
export function FormEditTitle({ className, ...props }: TypographyH4Props) {
  return <TypographyH4 className={cn('border-b pb-2', className)} {...props} />;
}
