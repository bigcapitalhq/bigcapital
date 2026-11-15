import type { ThemePreference } from '@/utils/theme-preference';

// Outline glyphs; Blueprint's icon set has no outline sun to pair with
// its desktop and moon icons.
const PATHS: Record<ThemePreference, JSX.Element> = {
  system: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  dark: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
};

interface AppearanceIconProps {
  preference: ThemePreference;
  label: string;
}

/**
 * Icon for an appearance preference; the label is its accessible name and
 * native tooltip.
 */
export function AppearanceIcon({ preference, label }: AppearanceIconProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{label}</title>
      {PATHS[preference]}
    </svg>
  );
}
