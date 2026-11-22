const preference = localStorage.getItem('theme');
const paymentPortal = window.location.pathname.startsWith('/payment');
const preferDark =
  preference === 'dark' ||
  (!preference && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (paymentPortal || preference === 'light' || preferDark) {
  const dark = !paymentPortal && preferDark;
  document.documentElement.classList.toggle('bp6-dark', dark);
  document.body.classList.toggle('bp6-dark', dark);
}
