const DARK_CLASS = 'bp4-dark';
const THEME_STORAGE_KEY = 'theme';

const applyTheme = (theme) => {
  document.documentElement.classList.remove(DARK_CLASS);
  document.body.classList.remove(DARK_CLASS);

  if (theme === 'dark') {
    document.documentElement.classList.add(DARK_CLASS);
    document.body.classList.add(DARK_CLASS);
  }
};

const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
const theme = storedTheme || systemTheme;

// Force light mode for public payment portal pages.
if (window.location.pathname.startsWith('/payment')) {
  applyTheme('light');
} else {
  applyTheme(theme);
}
