import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app } from '../init-app-test';
import { authHeaders } from './gl';

/**
 * Balance sheet e2e helpers that seed journals through the manual journals
 * API and read back the report through `GET /reports/balance-sheet`.
 *
 * The report is asserted with relative (delta) assertions against a baseline
 * captured before the fixture is seeded, which keeps the tests independent of
 * any data other spec files persist to the shared tenant database.
 */

export interface BSAccount {
  id: number;
  name: string;
  accountType: string;
}

export type AccountsByCode = Record<string, BSAccount>;

export interface BSJournalEntryInput {
  code: string;
  debit?: number;
  credit?: number;
  contactId?: number;
}

export interface BSNode {
  id: string | number;
  name?: string;
  code?: string;
  node_type?: string;
  total?: { amount: number; formatted_amount?: string; currency_code?: string };
  children?: BSNode[];
  horizontal_totals?: any[];
  previous_year?: any;
  previous_year_change?: any;
  previous_year_percentage?: any;
  previous_period?: any;
  previous_period_change?: any;
  previous_period_percentage?: any;
  percentage_column?: any;
  percentage_row?: any;
  [key: string]: any;
}

export interface BSQuery {
  fromDate?: string;
  toDate?: string;
  displayColumnsType?: 'total' | 'date_periods';
  displayColumnsBy?: string;
  noneZero?: boolean;
  noneTransactions?: boolean;
  previousYear?: boolean;
  previousPeriod?: boolean;
  previousYearAmountChange?: boolean;
  previousYearPercentageChange?: boolean;
  previousPeriodAmountChange?: boolean;
  percentageOfColumn?: boolean;
  percentageOfRow?: boolean;
}

/**
 * Indexes the tenant chart of accounts by their predefined codes so the
 * fixture can post journals against stable accounts regardless of ids.
 * Merges active and inactive accounts since some predefined accounts may
 * have been inactivated by other spec files.
 */
export const fetchAccountsByCode = async (): Promise<AccountsByCode> => {
  const fetchAccounts = (onlyInactive: boolean) =>
    request(app.getHttpServer())
      .get('/accounts')
      .query({ structure: 'flat', onlyInactive })
      .set(authHeaders())
      .expect(200);

  const [active, inactive] = await Promise.all([
    fetchAccounts(false),
    fetchAccounts(true),
  ]);

  const accounts = [
    ...(active.body.accounts ?? active.body.data ?? []),
    ...(inactive.body.accounts ?? inactive.body.data ?? []),
  ];
  return accounts.reduce((index, account) => {
    index[account.code] = {
      id: Number(account.id),
      name: account.name,
      accountType: account.account_type,
    };
    return index;
  }, {} as AccountsByCode);
};

/**
 * Posts a published manual journal against the accounts resolved by codes.
 */
export const createManualJournal = async (
  accountsByCode: AccountsByCode,
  journal: { date: string; entries: BSJournalEntryInput[] },
) => {
  const res = await request(app.getHttpServer())
    .post('/manual-journals')
    .set(authHeaders())
    .send({
      date: journal.date,
      journalNumber: `BS-${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
      reference: faker.string.uuid(),
      publish: true,
      entries: journal.entries.map((entry, i) => {
        const account = accountsByCode[entry.code];
        if (!account) {
          throw new Error(
            `Account code ${entry.code} not found in the chart of accounts (${Object.keys(accountsByCode).length} accounts)`,
          );
        }
        return {
          index: i + 1,
          accountId: account.id,
          debit: entry.debit ?? 0,
          credit: entry.credit ?? 0,
          ...(entry.contactId ? { contactId: entry.contactId } : {}),
        };
      }),
    });

  if (res.status !== 201) {
    throw new Error(
      `Manual journal failed (${res.status}): ${JSON.stringify(res.body)}`,
    );
  }

  return res.body.id;
};

/**
 * Retrieves the balance sheet statement (JSON sheet format).
 */
export const fetchBalanceSheet = async (query: BSQuery = {}) => {
  const res = await request(app.getHttpServer())
    .get('/reports/balance-sheet')
    .query({
      fromDate: '2023-01-01',
      toDate: '2023-12-31',
      ...query,
    })
    .set(authHeaders())
    .expect(200);

  return res.body;
};

/**
 * Deeply searches the report nodes by node id.
 */
export const findNode = (
  nodes: BSNode[],
  id: string | number,
): BSNode | undefined => {
  for (const node of nodes ?? []) {
    if (node.id === id) return node;
    const found = findNode(node.children ?? [], id);
    if (found) return found;
  }
  return undefined;
};

/**
 * Collects all nodes of the given node type.
 */
export const collectNodesByType = (
  nodes: BSNode[],
  nodeType: string,
  acc: BSNode[] = [],
): BSNode[] => {
  for (const node of nodes ?? []) {
    if (node.node_type === nodeType) acc.push(node);
    collectNodesByType(node.children ?? [], nodeType, acc);
  }
  return acc;
};

export const collectAccountNodes = (nodes: BSNode[]) =>
  collectNodesByType(nodes, 'ACCOUNT');

/**
 * Maps all account nodes to their total amounts keyed by account id.
 */
export const accountTotalsMap = (data: BSNode[]) =>
  collectAccountNodes(data).reduce(
    (map, node) => ({ ...map, [node.id]: node.total.amount }),
    {} as Record<string | number, number>,
  );

/**
 * Sums the total amount of the node direct children.
 */
export const childrenTotalSum = (node: BSNode): number =>
  (node.children ?? []).reduce((sum, child) => sum + child.total.amount, 0);

/**
 * Asserts the node total amount is close to the expected value.
 */
export const expectNodeTotal = (
  node: BSNode,
  amount: number,
  label = '',
): void => {
  if (!node) throw new Error(`Missing balance sheet node ${label}`);
  expect(node.total.amount).toBeCloseTo(amount, 2);
};

/**
 * Asserts the amount delta between a report and its baseline.
 */
export const expectDelta = (
  after: number,
  before: number,
  delta: number,
  _label = '',
): void => {
  expect(after - before).toBeCloseTo(delta, 2);
};
