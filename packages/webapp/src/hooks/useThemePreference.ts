import { useSyncExternalStore } from 'react';
import {
  DARK_COLOR_SCHEME_QUERY,
  DARK_STYLE_STORAGE_KEY,
  DEFAULT_DARK_STYLE,
  DEFAULT_THEME_PREFERENCE,
  DarkStyle,
  THEME_STORAGE_KEY,
  ThemePreference,
  parseDarkStyle,
  parseThemePreference,
  resolveTheme,
  toggledThemePreference,
} from '@/utils/theme-preference';

const listeners = new Set<() => void>();
let systemQuery: MediaQueryList | null = null;
let currentPreference = readStoredPreference();
let currentDarkStyle = readStoredDarkStyle();

function readStoredPreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    // Storage can be unavailable (e.g. blocked site data).
    return DEFAULT_THEME_PREFERENCE;
  }
}

function readStoredDarkStyle(): DarkStyle {
  try {
    return parseDarkStyle(window.localStorage.getItem(DARK_STYLE_STORAGE_KEY));
  } catch {
    return DEFAULT_DARK_STYLE;
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
 * Saves which dark palette to use and applies it immediately.
 */
export function setDarkStyle(style: DarkStyle) {
  currentDarkStyle = style;
  try {
    window.localStorage.setItem(DARK_STYLE_STORAGE_KEY, style);
  } catch {
    // Still apply the style for this session when it cannot be saved.
  }
  // The dark style token sets are keyed on this attribute.
  document.documentElement.dataset.darkStyle = style;
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

function getDarkStyleSnapshot() {
  return currentDarkStyle;
}

/**
 * The palette used when the theme is dark (Dark Protanopia or Soft Dark).
 */
export function useDarkStyle() {
  const darkStyle = useSyncExternalStore(subscribe, getDarkStyleSnapshot);

  return { darkStyle, setDarkStyle };
}
