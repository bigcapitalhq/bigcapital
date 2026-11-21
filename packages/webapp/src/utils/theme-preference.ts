export type ThemePreference = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

export const THEME_PREFERENCES: readonly ThemePreference[] = [
  'system',
  'light',
  'dark',
];

// Dark has always been the default, so a user who never picked keeps it.
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark';

// Also read by `public/preload-theme.js` before the app boots.
export const THEME_STORAGE_KEY = 'theme';

export const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/**
 * Parses a stored preference, falling back to the default for anything
 * missing or unrecognized.
 */
export function parseThemePreference(value: unknown): ThemePreference {
  return (
    THEME_PREFERENCES.find((preference) => preference === value) ??
    DEFAULT_THEME_PREFERENCE
  );
}

/**
 * Resolves the theme to display from the user's preference and the
 * operating system's color scheme.
 * Keep in sync with `public/preload-theme.js`.
 */
export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): Theme {
  if (preference === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return preference;
}

/**
 * The explicit preference that flips the theme currently shown (Shift+H).
 */
export function toggledThemePreference(current: Theme): ThemePreference {
  return current === 'dark' ? 'light' : 'dark';
}
