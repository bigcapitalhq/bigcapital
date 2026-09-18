import request = require('supertest');
import { app } from './init-app-test';
import { authHeaders } from './_utils/gl';
import { AccountsByCode, createManualJournal } from './_utils/balance-sheet';

interface TestAccount {
  id: number;
  name: string;
  code: string;
  accountType: string;
}

/**
 * A parent with three subaccounts and a top-level sibling, created in an order
 * that is not their code order: the sibling after the parent although its code
 * is lower, and the subaccounts from the highest code down.
 */
interface Family {
  sibling: TestAccount;
  parent: TestAccount;
  children: TestAccount[];
}

interface ReportNode {
  id?: number | string;
  name?: string;
  label?: string;
  children?: ReportNode[];
  [key: string]: unknown;
}

const DATE = '2021-06-15';
const PERIOD = { fromDate: '2021-06-01', toDate: '2021-06-30' };

const createAccount = async (
  fields: Omit<TestAccount, 'id'> & { parentAccountId?: number },
): Promise<TestAccount> => {
  const res = await request(app.getHttpServer())
    .post('/accounts')
    .set(authHeaders())
    .send(fields);

  if (res.status !== 201) {
    throw new Error(
      `Account ${fields.code} failed (${res.status}): ${JSON.stringify(res.body)}`,
    );
  }
  return { ...fields, id: Number(res.body.id) };
};

const createFamily = async (
  accountType: string,
  leading: string,
): Promise<Family> => {
  // Six-digit codes under a prefix of their own, so they sort among
  // themselves and clash with no seeded code.
  const prefix = `${leading}${Math.floor(100 + Math.random() * 900)}`;
  const tag = `${Date.now().toString(36)} ${accountType}`;
  const create = (suffix: string, label: string, parentAccountId?: number) =>
    createAccount({
      name: `Order ${tag} ${label}`,
      code: `${prefix}${suffix}`,
      accountType,
      parentAccountId,
    });

  const parent = await create('50', 'parent');
  const sibling = await create('20', 'sibling');
  const child90 = await create('90', 'child 90', parent.id);
  const child70 = await create('70', 'child 70', parent.id);
  const child10 = await create('10', 'child 10', parent.id);

  return { sibling, parent, children: [child10, child70, child90] };
};

/**
 * Moves amounts between the family's own accounts, so the accounts show up
 * with balances while no total outside the family changes.
 */
const postJournal = (family: Family) => {
  const accounts = [family.sibling, family.parent, ...family.children];
  const byCode = accounts.reduce(
    (index, account) => ({ ...index, [account.code]: account }),
    {} as AccountsByCode,
  );
  const [child10, child70, child90] = family.children;

  return createManualJournal(byCode, {
    date: DATE,
    entries: [
      { code: child90.code, debit: 30 },
      { code: child70.code, debit: 20 },
      { code: child10.code, debit: 10 },
      { code: family.sibling.code, credit: 60 },
    ],
  });
};

const fetchReport = async (url: string, query: object) => {
  const res = await request(app.getHttpServer())
    .get(url)
    .query({ noneZero: false, noneTransactions: false, ...query })
    .set(authHeaders())
    .expect(200);

  return res.body;
};

// The cash flow statement labels its account nodes rather than naming them.
const isNode = (value: unknown, account: TestAccount) =>
  typeof value === 'object' &&
  value !== null &&
  Number((value as ReportNode).id) === account.id &&
  ((value as ReportNode).name ?? (value as ReportNode).label) === account.name;

/**
 * Finds the list the account's node sits in, anywhere in the report. The
 * name is matched too, since ledger transactions carry numeric ids as well.
 */
const findSiblings = (
  value: unknown,
  account: TestAccount,
): ReportNode[] | undefined => {
  if (Array.isArray(value)) {
    if (value.some((item) => isNode(item, account))) return value;

    for (const item of value) {
      const found = findSiblings(item, account);
      if (found) return found;
    }
    return undefined;
  }
  if (typeof value === 'object' && value !== null) {
    for (const nested of Object.values(value)) {
      const found = findSiblings(nested, account);
      if (found) return found;
    }
  }
  return undefined;
};

const findNode = (report: unknown, account: TestAccount) =>
  findSiblings(report, account)?.find((node) => isNode(node, account));

const idsIn = (nodes: ReportNode[], accounts: TestAccount[]) => {
  const ids = accounts.map((account) => account.id);
  return nodes.map((node) => Number(node.id)).filter((id) => ids.includes(id));
};

const expectChartOrder = (report: unknown, family: Family) => {
  const { sibling, parent, children } = family;

  // Top level: the sibling, code ..20, before the parent, code ..50.
  const topLevel = findSiblings(report, parent);
  expect(topLevel).toBeDefined();
  expect(idsIn(topLevel, [sibling, parent])).toEqual([sibling.id, parent.id]);

  // The subaccounts stay under their parent, by code.
  const parentNode = findNode(report, parent);
  expect(idsIn(parentNode.children ?? [], children)).toEqual(
    children.map((child) => child.id),
  );
};

describe('Account order in reports (e2e)', () => {
  let expense: Family;
  let asset: Family;

  beforeAll(async () => {
    expense = await createFamily('expense', '9');
    asset = await createFamily('other-current-asset', '8');

    await postJournal(expense);
    await postJournal(asset);
  });

  it('/reports/profit-loss-sheet lists accounts in chart order', async () => {
    const report = await fetchReport('/reports/profit-loss-sheet', PERIOD);
    expectChartOrder(report, expense);
  });

  it('/reports/trial-balance-sheet lists accounts in chart order', async () => {
    const report = await fetchReport('/reports/trial-balance-sheet', PERIOD);
    expectChartOrder(report, expense);
  });

  it('/reports/general-ledger lists accounts in chart order', async () => {
    const report = await fetchReport('/reports/general-ledger', PERIOD);
    expectChartOrder(report, expense);
  });

  // The cash flow statement lists accounts flat, so each subaccount must come
  // right after its parent rather than under it.
  it('/reports/cashflow-statement lists accounts in chart order', async () => {
    const report = await fetchReport('/reports/cashflow-statement', PERIOD);
    const { sibling, parent, children } = asset;
    const family = [sibling, parent, ...children];

    expect(idsIn(findSiblings(report, parent) ?? [], family)).toEqual(
      family.map((account) => account.id),
    );
  });

  it('/reports/balance-sheet lists accounts in chart order', async () => {
    const report = await fetchReport('/reports/balance-sheet', {
      fromDate: '2021-01-01',
      toDate: PERIOD.toDate,
    });
    expectChartOrder(report, asset);
  });
});
