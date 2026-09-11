/** Shared horizontal gutters + max width — use on every page section. */
const SITE_CONTAINER_CLASS =
  'relative z-10 mx-auto w-full max-w-7xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 lg:px-8';

const INNER_MAX = {
  md: 'max-w-md',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
} as const;

type SiteInnerMax = keyof typeof INNER_MAX;

type SiteContainerProps = React.ComponentPropsWithoutRef<'div'>;

export function SiteContainer({ className, children, ...props }: SiteContainerProps) {
  return (
    <div
      className={[SITE_CONTAINER_CLASS, className].filter(Boolean).join(' ')}
      {...props}
    >
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
    <div
      className={['mx-auto w-full text-center', INNER_MAX[max], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
