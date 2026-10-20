import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

interface AccountRow {
  id: number;
  name: string;
  slug: string;
  code: string;
  accountType?: string;
  account_type?: string;
  parentAccountId?: number | null;
  parent_account_id?: number | null;
}

const TEMPLATE = 'united-states';

const get = (url: string, organizationId = orgainzationId) =>
  request(app.getHttpServer())
    .get(url)
    .set('organization-id', organizationId)
    .set('Authorization', AuthorizationHeader);

const post = (url: string, body: object, organizationId = orgainzationId) =>
  request(app.getHttpServer())
    .post(url)
    .set('organization-id', organizationId)
    .set('Authorization', AuthorizationHeader)
    .send(body);

const put = (url: string, body: object, organizationId = orgainzationId) =>
  request(app.getHttpServer())
    .put(url)
    .set('organization-id', organizationId)
    .set('Authorization', AuthorizationHeader)
    .send(body);

const listAccounts = async (organizationId: string): Promise<AccountRow[]> => {
  // Flat, since the default tree nests child accounts under their parent.
  const response = await get('/accounts?structure=flat', organizationId).expect(
    200,
  );
  return response.body.accounts ?? response.body;
};

const parentOf = (account: AccountRow) =>
  account.parentAccountId ?? account.parent_account_id ?? null;

/**
 * Creates a workspace of its own, so the template is applied to a chart that
 * has never been touched rather than the one the other suites write to.
 */
const createWorkspace = async (): Promise<string> => {
  const created = await request(app.getHttpServer())
    .post('/workspaces')
    .set('Authorization', AuthorizationHeader)
    .send({
      name: `Accounts template ${Date.now()}`,
      location: 'US',
      baseCurrency: 'USD',
      timezone: 'America/New_York',
      fiscalYear: 'january',
      language: 'en',
    })
    .expect(200);

  const organizationId =
    created.body.organization_id ?? created.body.organizationId;
  const jobId = created.body.job_id ?? created.body.jobId;

  for (let attempt = 0; attempt < 60; attempt++) {
    const job = await request(app.getHttpServer())
      .get(`/workspaces/build/${jobId}`)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    if (job.body.state === 'completed') return organizationId;
    if (job.body.state === 'failed') {
      throw new Error(`Workspace build failed: ${JSON.stringify(job.body)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error('Timed out waiting for the workspace to build.');
};

describe('Accounts templates (e2e)', () => {
  it('/accounts-templates (GET)', async () => {
    const response = await get('/accounts-templates').expect(200);

    expect(response.body).toContainEqual(
      expect.objectContaining({
        key: TEMPLATE,
        variants: expect.arrayContaining([
          expect.objectContaining({ key: 'corporation' }),
          expect.objectContaining({ key: 'partnership' }),
          expect.objectContaining({ key: 'sole-proprietorship' }),
        ]),
      }),
    );
  });

  it('/accounts-templates/:key/preview (GET) of an unknown template', () => {
    return get('/accounts-templates/atlantis/preview').expect(404);
  });

  it('/accounts-templates/:key/preview (GET) of an unknown variant', async () => {
    const response = await get(
      `/accounts-templates/${TEMPLATE}/preview?variant=trust`,
    ).expect(400);

    expect(response.body.errors[0].type).toBe(
      'ACCOUNTS_TEMPLATE_VARIANT_NOT_FOUND',
    );
  });

  it('/accounts-templates/:key/preview (GET) writes nothing', async () => {
    const before = await listAccounts(orgainzationId);

    const response = await get(
      `/accounts-templates/${TEMPLATE}/preview?variant=corporation`,
    ).expect(200);

    expect(response.body.changes.length).toBeGreaterThan(0);
    expect(await listAccounts(orgainzationId)).toEqual(before);
  });

  describe('on a new workspace', () => {
    let workspaceId: string;
    let seeded: AccountRow[];
    let saving: AccountRow;
    let results: request.Response[];
    let applied: request.Response;
    let accounts: AccountRow[];

    const byCode = (code: string) => accounts.find((a) => a.code === code);
    const apply = () =>
      post(
        `/accounts-templates/${TEMPLATE}/apply`,
        { variant: 'corporation' },
        workspaceId,
      );

    // Applied once here rather than in a test, so a retried test repeats its
    // assertions instead of applying the template a second time.
    beforeAll(async () => {
      workspaceId = await createWorkspace();
      seeded = await listAccounts(workspaceId);
      saving = seeded.find((a) => a.slug === 'saving-bank-account');

      // Sales receipts default to the savings account, which the template
      // would otherwise remove.
      await put(
        '/settings',
        {
          options: [
            {
              group: 'sales_receipts',
              key: 'preferred_deposit_account',
              value: saving.id,
            },
          ],
        },
        workspaceId,
      ).expect(200);

      // Two at once, as from two tabs or a retried request.
      results = await Promise.all([apply(), apply()]);
      applied =
        results.find((result) => result.body.summary?.create > 0) ?? results[0];
      accounts = await listAccounts(workspaceId);
    }, 180_000);

    afterAll(async () => {
      if (!workspaceId) return;

      await request(app.getHttpServer())
        .delete(`/workspaces/${workspaceId}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader);
    });

    it('/accounts-templates/:key/apply (POST)', () => {
      expect(results.map((result) => result.status)).toEqual([200, 200]);
      expect(applied.body.errors).toEqual([]);
      expect(applied.body.summary).toMatchObject({ remove: 4, skipped: 2 });
    });

    it('applies once when two requests race', () => {
      const other = results.find((result) => result !== applied);

      expect(other.body.summary).toMatchObject({
        update: 0,
        create: 0,
        remove: 0,
      });
      expect(accounts.filter((a) => a.code === '1450')).toHaveLength(1);
    });

    it('keeps an account a setting points at', () => {
      expect(accounts.find((a) => a.id === saving.id)).toBeDefined();
      expect(applied.body.warnings).toContainEqual(
        expect.objectContaining({
          type: 'ACCOUNT_REFERENCED',
          account_id: saving.id,
        }),
      );
    });

    it('renumbers system accounts in place', () => {
      const bank = seeded.find((a) => a.slug === 'bank-account');

      expect(byCode('1010')).toMatchObject({
        id: bank.id,
        slug: 'bank-account',
        name: 'Business Checking',
      });
      expect(byCode('3000').name).toBe('Common Stock');
      expect(byCode('3100').name).toBe('Shareholder Distributions');
      expect(byCode('4990').slug).toBe('other-income');
    });

    it('creates the missing accounts under their parent', () => {
      expect(byCode('1450').name).toBe('Security Deposits');
      expect(parentOf(byCode('6360'))).toBe(byCode('6355').id);
    });

    it('removes the seeded accounts the template has no place for', () => {
      expect(accounts.find((a) => a.slug === 'owner-drawings')).toBeUndefined();
      expect(accounts).toHaveLength(seeded.length - 4 + 36);
    });

    it('leaves no account on a seeded five- or six-digit code', () => {
      // Bar the savings account, which is kept as it stands.
      expect(
        accounts.filter(
          (a) => a.id !== saving.id && /^\d{5,6}$/.test(a.code ?? ''),
        ),
      ).toEqual([]);
    });

    it('/accounts-templates/:key/apply (POST) a second time changes nothing', async () => {
      const response = await post(
        `/accounts-templates/${TEMPLATE}/apply`,
        { variant: 'corporation' },
        workspaceId,
      ).expect(200);

      expect(response.body.summary).toMatchObject({
        update: 0,
        create: 0,
        remove: 0,
      });
    });

    it('still posts customer opening balances to Other Income', async () => {
      // CustomerGLEntriesStorage looks the income account up by the
      // `other-income` slug; the template must not have broken that.
      const displayName = `Opening balance ${Date.now()}`;

      await post(
        '/customers',
        {
          customerType: 'business',
          currencyCode: 'USD',
          displayName,
          openingBalance: 100,
          openingBalanceAt: '2026-01-01',
        },
        workspaceId,
      ).expect(201);

      const otherIncome = byCode('4990');
      const response = await get(
        `/accounts/transactions?account_id=${otherIncome.id}`,
        workspaceId,
      ).expect(200);
      const transactions = response.body.transactions ?? response.body;

      expect(transactions).toContainEqual(
        expect.objectContaining({ credit: 100 }),
      );
    });
  });

  it('/accounts-templates/:key/apply (POST) refuses a blocking conflict and writes nothing', async () => {
    // The shared organization gets a user account on the code the template
    // wants for the bank account, so applying is refused before any write.
    const clash = await post('/accounts', {
      name: `Template clash ${Date.now()}`,
      accountType: 'bank',
      code: '1010',
    });
    // The code may already exist from an earlier run of this suite.
    expect([201, 400]).toContain(clash.status);

    const before = await listAccounts(orgainzationId);
    const response = await post(`/accounts-templates/${TEMPLATE}/apply`, {
      variant: 'corporation',
    }).expect(400);

    expect(response.body.errors[0].type).toBe(
      'ACCOUNTS_TEMPLATE_CANNOT_BE_APPLIED',
    );
    expect(response.body.errors[0].payload.errors).toContainEqual(
      expect.objectContaining({ type: 'DUPLICATE_CODE', code: '1010' }),
    );
    expect(await listAccounts(orgainzationId)).toEqual(before);
  });
});
