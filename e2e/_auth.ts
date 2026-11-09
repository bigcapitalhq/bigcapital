import { faker } from '@faker-js/faker';

const API_PREFIX = '/api';

export interface UserCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthSession {
  credentials: UserCredentials;
  accessToken: string;
  organizationId: string;
  tenantId: number;
  userId: number;
}

export interface OnboardedSession extends AuthSession {
  organizationName: string;
}

interface AuthSigninResponse {
  access_token: string;
  organization_id: string;
  tenant_id: number;
  user_id: number;
}

async function assertOk(res: Response, context: string): Promise<any> {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const hint =
      res.status === 401 &&
      typeof body?.message === 'string' &&
      body.message.toLowerCase().includes('not verified')
        ? '\n[global-setup] Hint: set SIGNUP_EMAIL_CONFIRMATION=false in .env and restart the server.'
        : '';
    throw new Error(
      `[global-setup] ${context} failed: ${res.status} ${res.statusText} ${JSON.stringify(body)}${hint}`
    );
  }
  return body;
}

async function send(
  url: string,
  init: RequestInit,
  context: string
): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (err: any) {
    const cause = err?.cause ? ` (cause: ${err.cause.code ?? err.cause.message ?? err.cause})` : '';
    throw new Error(
      `[global-setup] ${context}: could not reach ${url}${cause}. ` +
        `Is the webapp dev server running and proxying /api to the NestJS server?`
    );
  }
}

export function generateCredentials(): UserCredentials {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  };
}

export async function signupUser(
  apiBase: string,
  creds: UserCredentials
): Promise<void> {
  const res = await send(
    `${apiBase}${API_PREFIX}/auth/signup`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        first_name: creds.firstName,
        last_name: creds.lastName,
        email: creds.email,
        password: creds.password,
      }),
    },
    'signup'
  );
  await assertOk(res, 'signup');
}

export async function signInUser(
  apiBase: string,
  creds: UserCredentials
): Promise<AuthSession> {
  const res = await send(
    `${apiBase}${API_PREFIX}/auth/signin`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: creds.email, password: creds.password }),
    },
    'signin'
  );
  const data: AuthSigninResponse = await assertOk(res, 'signin');
  return {
    credentials: creds,
    accessToken: data.access_token,
    organizationId: data.organization_id,
    tenantId: data.tenant_id,
    userId: data.user_id,
  };
}

interface BuildJobResponse {
  id: string;
  state: string;
  progress: number | Record<string, unknown>;
  is_completed: boolean;
  is_running: boolean;
  is_waiting: boolean;
  is_failed: boolean;
}

export async function buildOrganization(
  apiBase: string,
  session: AuthSession,
  payload: {
    name: string;
    location: string;
    base_currency: string;
    timezone: string;
    fiscal_year: string;
    language: string;
  }
): Promise<string> {
  const res = await send(
    `${apiBase}${API_PREFIX}/organization/build`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${session.accessToken}`,
        'organization-id': session.organizationId,
      },
      body: JSON.stringify(payload),
    },
    'organization/build'
  );
  const body = await assertOk(res, 'organization/build');
  const jobId: string | undefined = body?.data?.job_id ?? body?.data?.jobId;
  if (!jobId) {
    throw new Error(
      `[global-setup] organization/build response missing job id: ${JSON.stringify(body)}`
    );
  }
  return jobId;
}

export async function waitForOrganizationBuild(
  apiBase: string,
  session: AuthSession,
  jobId: string,
  opts: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<void> {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const intervalMs = opts.intervalMs ?? 2_000;
  const deadline = Date.now() + timeoutMs;

  let last: BuildJobResponse | undefined;
  while (Date.now() < deadline) {
    const res = await send(
      `${apiBase}${API_PREFIX}/organization/build/${jobId}`,
      {
        headers: {
          authorization: `Bearer ${session.accessToken}`,
          'organization-id': session.organizationId,
        },
      },
      'organization/build/:jobId'
    );
    last = (await assertOk(res, 'organization/build/:jobId')) as BuildJobResponse;
    if (last.is_failed) {
      throw new Error(
        `[global-setup] organization build job ${jobId} failed. State: ${last.state}`
      );
    }
    if (last.is_completed) {
      return;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(
    `[global-setup] organization build job ${jobId} did not complete within ${timeoutMs}ms. Last state: ${last?.state}`
  );
}

export async function createOnboardedUser(
  apiBase: string,
  overrides?: Partial<{
    credentials: UserCredentials;
    organizationName: string;
    location: string;
    baseCurrency: string;
    timezone: string;
    fiscalYear: string;
    language: string;
  }>
): Promise<OnboardedSession> {
  const credentials = overrides?.credentials ?? generateCredentials();
  const organizationName =
    overrides?.organizationName ?? faker.company.name();

  await signupUser(apiBase, credentials);

  const session = await signInUser(apiBase, credentials);

  const jobId = await buildOrganization(apiBase, session, {
    name: organizationName,
    location: overrides?.location ?? 'AL',
    base_currency: overrides?.baseCurrency ?? 'AED',
    timezone: overrides?.timezone ?? 'Pacific/Marquesas',
    fiscal_year: overrides?.fiscalYear ?? 'june',
    language: overrides?.language ?? 'en',
  });
  await waitForOrganizationBuild(apiBase, session, jobId);

  return { ...session, organizationName };
}

export function authCookies(session: AuthSession, domain: string) {
  return [
    { name: 'token', value: session.accessToken, domain, path: '/' },
    {
      name: 'authenticated_user_id',
      value: String(session.userId),
      domain,
      path: '/',
    },
    {
      name: 'organization_id',
      value: session.organizationId,
      domain,
      path: '/',
    },
    {
      name: 'tenant_id',
      value: String(session.tenantId),
      domain,
      path: '/',
    },
  ];
}
