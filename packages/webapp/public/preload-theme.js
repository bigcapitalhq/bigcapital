// Applies the saved appearance before first paint so the page never flashes
// the wrong theme. Loaded as a classic (blocking) script at the top of <body>.
// Keep the rules in sync with `resolveTheme` in src/utils/theme-preference.ts.
(function () {
  let preference = 'dark';
  let darkStyle = 'protanopia';
  try {
    preference = localStorage.getItem('theme') || 'dark';
    darkStyle = localStorage.getItem('dark-style') || 'protanopia';
  } catch (error) {
    // Storage can be unavailable (e.g. blocked site data); keep the defaults.
  }
  const systemPrefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Anything other than an explicit light choice or a light system stays dark.
  let isDark =
    preference === 'light'
      ? false
      : preference === 'system'
        ? systemPrefersDark
        : true;

  // Payment portal pages are always light.
  if (window.location.pathname.startsWith('/payment')) {
    isDark = false;
  }
  // The dark style token sets are keyed on this attribute; see
  // `parseDarkStyle` in src/utils/theme-preference.ts.
  document.documentElement.dataset.darkStyle =
    darkStyle === 'soft' ? 'soft' : 'protanopia';
  document.documentElement.classList.toggle('bp4-dark', isDark);
  document.body.classList.toggle('bp4-dark', isDark);
})();
