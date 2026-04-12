/** Explicit classes for accent colors (Tailwind cannot see dynamic `bg-${x}` strings). */
export const accentIcon = {
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
} as const;

export type AccentKey = keyof typeof accentIcon;
