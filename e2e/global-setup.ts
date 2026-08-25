import { chromium, FullConfig } from '@playwright/test';
import {
  generateCredentials,
  signupUser,
  signInUser,
  buildOrganization,
  waitForOrganizationBuild,
  authCookies,
  OnboardedSession,
} from './_auth';
import { defaultPageConfig } from './_utils';

const STORAGE_STATE_PATH = 'e2e/.auth/user.json';

function log(step: string, extra: Record<string, unknown> = {}) {
  const ts = new Date().toISOString();
  const kv = Object.entries(extra)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
  console.log(`[global-setup] ${ts} ${step}${kv ? ` | ${kv}` : ''}`);
}

async function step<T>(
  name: string,
  fn: () => Promise<T>,
  extra?: Record<string, unknown>
): Promise<T> {
  const start = Date.now();
  log(`start: ${name}`, extra);
  try {
    const result = await fn();
    log(`done: ${name} (${Date.now() - start}ms)`);
    return result;
  } catch (err) {
    log(`FAILED: ${name} (${Date.now() - start}ms)`, {
      error: (err as Error).message,
    });
    throw err;
  }
}

export default async function globalSetup(config: FullConfig) {
  const apiBase =
    process.env.PLAYWRIGHT_TEST_API_URL ||
    process.env.PLAYWRIGHT_TEST_BASE_URL ||
    'http://localhost:3000';
  const webappUrl =
    config.projects[0]?.use?.baseURL ||
    process.env.PLAYWRIGHT_TEST_BASE_URL ||
    'http://localhost:4000';
  const domain = new URL(webappUrl).hostname;

  log('global setup starting', { apiBase, webappUrl });

  const credentials = generateCredentials();
  let session: OnboardedSession;

  try {
    await step('signup', () => signupUser(apiBase, credentials), {
      email: credentials.email,
    });

    const authed = await step('signin', () => signInUser(apiBase, credentials));

    const organizationName = `${credentials.firstName}'s Org`;
    const jobId = await step(
      'submit organization/build',
      () => buildOrganization(apiBase, authed, {
        name: organizationName,
        location: 'AL',
        base_currency: 'AED',
        timezone: 'Pacific/Marquesas',
        fiscal_year: 'june',
        language: 'en',
      }),
      { organization_id: authed.organizationId }
    );

    await step(
      'wait for organization build job',
      () => waitForOrganizationBuild(apiBase, authed, jobId),
      { job_id: jobId }
    );

    session = { ...authed, organizationName };
  } catch (err) {
    console.error(
      `[global-setup] Aborting. Ensure the server is running at ${apiBase} and SIGNUP_EMAIL_CONFIRMATION is disabled.`
    );
    throw err;
  }

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ ...defaultPageConfig() });
    await context.addCookies(authCookies(session, domain));
    log('injected auth cookies', { domain });

    const page = await context.newPage();
    await step('load dashboard', async () => {
      await page.goto(webappUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testId="dashboard-topbar"]', {
        timeout: 60_000,
      });
    });

    await step('save storageState', () =>
      context.storageState({ path: STORAGE_STATE_PATH })
    );
  } catch (err) {
    console.error(
      `[global-setup] Dashboard did not load after injecting auth cookies.\n` +
        `Likely cause: storageState was saved before the SPA bootstrapped, or auth cookies are not being honored.`
    );
    throw err;
  } finally {
    await browser.close();
  }

  log('global setup complete', {
    email: session.credentials.email,
    organization: session.organizationName,
    storage_state: STORAGE_STATE_PATH,
  });
}

export { STORAGE_STATE_PATH };
