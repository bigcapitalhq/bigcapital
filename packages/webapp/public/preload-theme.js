const theme =
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light');

if (theme === 'dark') {
  document.documentElement.classList.add('bp4-dark');
  document.body.classList.add('bp4-dark');
}

// Remove dark mode for payment portal pages
if (window.location.pathname.startsWith('/payment')) {
  document.documentElement.classList.remove('bp4-dark');
  document.body.classList.remove('bp4-dark');
}
