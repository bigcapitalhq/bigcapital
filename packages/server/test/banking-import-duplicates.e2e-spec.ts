import request = require('supertest');
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

// main.ts sets the static folder that import uploads are stored in; the test
// app doesn't run main.ts, so point it at a temp folder or every upload fails.
const staticDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bc-import-e2e-'));
fs.mkdirSync(path.join(staticDir, 'imports'));
(global as any).__static_dirname = staticDir;

afterAll(() => {
  fs.rmSync(staticDir, { recursive: true, force: true });
});

// Each test builds on the account state the previous one committed, so a
// retry would re-import into it and report misleading counts.
jest.retryTimes(0);

const HEADER = 'Date,Payee,Description,Amount';

// Jan 2–10 download: two identical coffees on Jan 8 are both real.
const FILE_A = [
  HEADER,
  '2026-01-02,Hydro Quebec,Electricity,-120.00',
  '2026-01-05,Client Inc,Invoice 42,1500.00',
  '2026-01-08,Tim Hortons,Coffee,-5.00',
  '2026-01-08,Tim Hortons,Coffee,-5.00',
].join('\n');

// Jan 8–15 download: repeats both Jan 8 coffees and adds one new row.
const FILE_B = [
  HEADER,
  '2026-01-08,Tim Hortons,Coffee,-5.00',
  '2026-01-08,Tim Hortons,Coffee,-5.00',
  '2026-01-12,Metro,Groceries,-64.30',
].join('\n');

const MAPPING = [
  { from: 'Date', to: 'date' },
  { from: 'Payee', to: 'payee' },
  { from: 'Description', to: 'description' },
  { from: 'Amount', to: 'amount' },
];

const api = () => request(app.getHttpServer());
const authed = <T extends request.Test>(req: T): T =>
  req
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader) as T;

/**
 * Uploads, maps, previews and imports the given CSV into the bank account.
 */
const importCsv = async (accountId: number, csv: string) => {
  const upload = await authed(api().post('/import/file'))
    .attach('file', Buffer.from(csv), 'bank.csv')
    .field('resource', 'UncategorizedBankTransaction')
    .field('params', JSON.stringify({ accountId }));
  expect(upload.status).toBeLessThan(300);
  const importId = upload.body.import.import_id;

  await authed(api().post(`/import/${importId}/mapping`))
    .send({ mapping: MAPPING })
    .expect((res) => expect(res.status).toBeLessThan(300));

  const preview = await authed(api().get(`/import/${importId}/preview`));
  expect(preview.status).toBe(200);

  const result = await authed(api().post(`/import/${importId}/import`));
  expect(result.status).toBeLessThan(300);

  return { preview: preview.body, result: result.body };
};

describe('Bank statement import duplicates (e2e)', () => {
  let accountId: number;

  beforeAll(async () => {
    const account = await authed(api().post('/accounts'))
      .send({
        name: `Import dedupe ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
        accountType: 'bank',
        code: faker.string.alphanumeric({ length: 6 }).toUpperCase(),
      })
      .expect(201);
    accountId = account.body.id;
  });

  it('imports identical rows from one file', async () => {
    const { preview, result } = await importCsv(accountId, FILE_A);

    expect(preview.created_count).toBe(4);
    expect(preview.skipped_count).toBe(0);
    expect(result.created_count).toBe(4);
  });

  it('skips the rows of an overlapping file already in the account', async () => {
    const { preview, result } = await importCsv(accountId, FILE_B);

    expect(preview.created_count).toBe(1);
    expect(preview.skipped_count).toBe(2);
    expect(preview.errors_count).toBe(0);
    expect(preview.errors).toHaveLength(2);
    preview.errors.forEach((error) => {
      expect(error.error_code).toBe('DuplicateBankTransaction');
      expect(error.error_message).toBe(
        'Already in this bank account: 2026-01-08, Tim Hortons, -5.00',
      );
    });
    expect(result.created_count).toBe(1);
    expect(result.skipped_count).toBe(2);
  });

  it('leaves each real transaction in the account once', async () => {
    const list = await authed(
      api().get(`/banking/uncategorized/accounts/${accountId}`),
    ).expect(200);

    expect(list.body.data).toHaveLength(5);
  });

  it('creates nothing when the same file is imported again', async () => {
    const { result } = await importCsv(accountId, FILE_A);

    expect(result.created_count).toBe(0);
    expect(result.skipped_count).toBe(4);
  });
});
