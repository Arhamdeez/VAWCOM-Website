import { cn } from '@/lib/utils';

/** Shared horizontal gutters + max width — use on every page section. */
export const SITE_CONTAINER_CLASS =
  'relative z-10 mx-auto w-full max-w-7xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 lg:px-8';

const INNER_MAX = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
} as const;

export type SiteInnerMax = keyof typeof INNER_MAX;

type SiteContainerProps = React.ComponentPropsWithoutRef<'div'> & {
  /** Flex wrapper to center an inner SiteCenter block */
  center?: boolean;
};

export function SiteContainer({ className, center, children, ...props }: SiteContainerProps) {
  return (
    <div className={cn(SITE_CONTAINER_CLASS, center && 'flex justify-center', className)} {...props}>
      {children}
    </div>
  );
}

type SiteCenterProps = React.ComponentPropsWithoutRef<'div'> & {
  max?: SiteInnerMax;
};

/** Centered content column inside SiteContainer. */
export function SiteCenter({ className, max = '3xl', children, ...props }: SiteCenterProps) {
  return (
    <div className={cn('mx-auto w-full text-center', INNER_MAX[max], className)} {...props}>
      {children}
    </div>
  );
}
