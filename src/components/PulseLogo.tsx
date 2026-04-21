import { cn } from '@/lib/utils';

type PulseLogoProps = {
  className?: string;
  /**
   * Use the PNG in /public. It contains a space, so we URL-encode it.
   */
  src?: string;
  alt?: string;
  priority?: boolean;
};

export function PulseLogo({
  className,
  src = '/Pulse%20Logo.png',
  alt = 'Pulse',
  priority = false,
}: PulseLogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('block h-7 w-auto select-none', className)}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      draggable={false}
    />
  );
}

