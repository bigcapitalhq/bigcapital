import { chromium } from '@playwright/test';

const baseURL = 'http://localhost:4000';
const route = process.argv[2] || '/accounts';
const waitMs = Number(process.argv[3] || 20000);

const browser = await chromium.launch();
const context = await browser.newContext({ storageState: 'e2e/.auth/user.json', baseURL });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300));
});
page.on('pageerror', (err) => consoleErrors.push('PAGEERROR: ' + String(err).slice(0, 300)));

await page.goto(route, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(waitMs);

const h1 = await page.getByTestId('dashboard-topbar').locator('h1').textContent().catch(() => null);
const newAccountBtn = await page.getByRole('button', { name: 'New Account' }).count().catch(() => -1);
const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500).replace(/\n+/g, ' | '));
const url = page.url();

console.log('URL:', url);
console.log('H1:', h1);
console.log('New Account button count:', newAccountBtn);
console.log('BODY TEXT:', bodyText);
console.log('CONSOLE ERRORS (' + consoleErrors.length + '):');
for (const e of consoleErrors.slice(0, 25)) console.log('  -', e);

await browser.close();
