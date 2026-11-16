import { useSyncExternalStore } from 'react';
import {
  DARK_COLOR_SCHEME_QUERY,
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
  ThemePreference,
  parseThemePreference,
  resolveTheme,
  toggledThemePreference,
} from '@/utils/theme-preference';

const listeners = new Set<() => void>();
let systemQuery: MediaQueryList | null = null;
let currentPreference = readStoredPreference();

function readStoredPreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    // Storage can be unavailable (e.g. blocked site data).
    return DEFAULT_THEME_PREFERENCE;
  }
}

function systemPrefersDark(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches
  );
}

function applyTheme() {
  const isDark =
    resolveTheme(currentPreference, systemPrefersDark()) === 'dark';

  // Blueprint's dark styles match any `.bp4-dark` ancestor, so <html> and
  // <body> must always agree; a stale class on <html> left light-mode
  // controls painted with dark-mode text colors.
  document.documentElement.classList.toggle('bp4-dark', isDark);
  document.body.classList.toggle('bp4-dark', isDark);
}

/**
 * Saves the appearance preference and applies it immediately.
 */
export function setThemePreference(preference: ThemePreference) {
  currentPreference = preference;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Still apply the theme for this session when it cannot be saved.
  }
  applyTheme();
  listeners.forEach((listener) => listener());
}

/**
 * Flips the theme currently shown and remembers it as an explicit choice.
 */
export function toggleTheme() {
  const current = resolveTheme(currentPreference, systemPrefersDark());
  setThemePreference(toggledThemePreference(current));
}

function handleSystemSchemeChange() {
  if (currentPreference === 'system') {
    applyTheme();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Follow the OS color scheme live while anything is subscribed.
  if (!systemQuery && typeof window.matchMedia === 'function') {
    systemQuery = window.matchMedia(DARK_COLOR_SCHEME_QUERY);
    systemQuery.addEventListener('change', handleSystemSchemeChange);
  }
  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && systemQuery) {
      systemQuery.removeEventListener('change', handleSystemSchemeChange);
      systemQuery = null;
    }
  };
}

function getSnapshot() {
  return currentPreference;
}

/**
 * The user's appearance preference (System, Light or Dark).
 */
export function useThemePreference() {
  const preference = useSyncExternalStore(subscribe, getSnapshot);

  return { preference, setThemePreference, toggleTheme };
}
