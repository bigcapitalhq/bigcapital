import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from '../init-app-test';

/**
 * GL test helpers that assert on the `accounts_transactions` legs posted for a
 * given transaction, read back through `GET /reports/transactions-by-reference`.
 */

export interface GLTestLeg {
  accountId: number;
  accountCode: string;
  accountName: string;
  contactId: number;
  contactType: string;
  credit: { amount: number };
  debit: { amount: number };
  referenceType: string;
  referenceId: number;
}

export interface RawGLTestLeg {
  account_id?: number;
  account_code?: string;
  account_name?: string;
  contact_id?: number;
  contact_type?: string;
  credit?: { amount?: number } | number;
  debit?: { amount?: number } | number;
  reference_type?: string;
  reference_id?: number;
}

export const authHeaders = () => ({
  'organization-id': orgainzationId,
  Authorization: AuthorizationHeader,
});

export const cancelTransactionsLock = () =>
  request(app.getHttpServer())
    .put('/transactions-locking/cancel-lock')
    .set(authHeaders())
    .send({ reason: 'Cancel lock for GL e2e test' })
    .expect(200);

/**
 * Retrieves the organization base currency so tests can create contacts in the
 * tenant's base currency (which uses the seeded chart of accounts).
 */
export const getBaseCurrency = async (): Promise<string> => {
  const res = await request(app.getHttpServer())
    .get('/organization/current')
    .set(authHeaders())
    .expect(200);

  return res.body.metadata.base_currency;
};

const legAmount = (amount: any): number =>
  Number(amount?.amount ?? amount ?? 0);

/**
 * Fetches the GL legs posted for a transaction reference.
 * The report endpoint serializes camelCase DTO keys to snake_case on the wire,
 * so the raw legs are normalized here for convenient assertions.
 */
export const fetchLegs = async (
  referenceType: string,
  referenceId: number,
): Promise<GLTestLeg[]> => {
  const res = await request(app.getHttpServer())
    .get('/reports/transactions-by-reference')
    .set(authHeaders())
    .query({ referenceType, referenceId })
    .expect(200);

  return (res.body.transactions as RawGLTestLeg[]).map((t) => ({
    accountId: t.account_id,
    accountCode: t.account_code,
    accountName: t.account_name,
    contactId: t.contact_id,
    contactType: t.contact_type,
    credit: { amount: legAmount(t.credit) },
    debit: { amount: legAmount(t.debit) },
    referenceType: t.reference_type,
    referenceId: t.reference_id,
  }));
};

export const sumDebits = (legs: GLTestLeg[]) =>
  legs.reduce((sum, leg) => sum + legAmount(leg.debit), 0);

export const sumCredits = (legs: GLTestLeg[]) =>
  legs.reduce((sum, leg) => sum + legAmount(leg.credit), 0);

/**
 * Asserts the journal is balanced (total debits equal total credits).
 */
export const expectBalanced = (legs: GLTestLeg[]) => {
  const debits = sumDebits(legs);
  const credits = sumCredits(legs);

  expect(debits).toBeCloseTo(credits, 2);
};

export interface GLExpectLeg {
  accountCode?: string;
  contactId?: number;
  debit?: number;
  credit?: number;
}

/**
 * Asserts a leg exists matching the given account code and/or contact id and
 * carries the expected debit/credit amount (close to two decimal places).
 */
export const expectLeg = (
  legs: GLTestLeg[],
  expected: GLExpectLeg,
  label = '',
) => {
  const { accountCode, contactId, debit, credit } = expected;
  const leg = legs.find(
    (l) =>
      (accountCode !== undefined ? l.accountCode === accountCode : true) &&
      (contactId !== undefined ? l.contactId === contactId : true),
  );

  if (!leg) {
    throw new Error(`Missing GL leg for ${label} ${JSON.stringify(expected)}`);
  }

  if (debit !== undefined) {
    expect(legAmount(leg.debit)).toBeCloseTo(debit, 2);
  }
  if (credit !== undefined) {
    expect(legAmount(leg.credit)).toBeCloseTo(credit, 2);
  }
};

/**
 * Asserts the journal contains only the expected legs (matched by account code
 * for non-contact legs and by contact id for contact legs), ignoring any
 * zero-amount legs.
 */
export const expectLegs = (
  legs: GLTestLeg[],
  expected: GLExpectLeg[],
  referenceLabel = '',
) => {
  const nonZeroLegs = legs.filter(
    (leg) => legAmount(leg.debit) !== 0 || legAmount(leg.credit) !== 0,
  );

  expect(nonZeroLegs.length).toBe(expected.length);

  expected.forEach((exp) => expectLeg(nonZeroLegs, exp, referenceLabel));
};

export const createCustomer = async (currencyCode: string) => {
  const res = await request(app.getHttpServer())
    .post('/customers')
    .set(authHeaders())
    .send({
      displayName: `GL Test Customer ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
      customerType: 'business',
      currencyCode,
    })
    .expect(201);

  return res.body.id;
};

export const createVendor = async (currencyCode: string) => {
  const res = await request(app.getHttpServer())
    .post('/vendors')
    .set(authHeaders())
    .send({
      displayName: `GL Test Vendor ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
      currencyCode,
    })
    .expect(201);

  return res.body.id;
};

export const createServiceItem = async () => {
  const res = await request(app.getHttpServer())
    .post('/items')
    .set(authHeaders())
    .send({
      name: `${faker.commerce.productName()} ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
      type: 'service',
      sellable: true,
      purchasable: true,
      sellAccountId: 1026,
      costAccountId: 1019,
      costPrice: 100,
      sellPrice: 100,
    })
    .expect(201);

  return parseInt(res.body.id, 10);
};

export const createTaxRate = async (rate: number) => {
  const res = await request(app.getHttpServer())
    .post('/tax-rates')
    .set(authHeaders())
    .send({
      name: `GL Tax ${rate}% ${faker.string.alphanumeric({ length: 4 })}`,
      rate,
      code: faker.string.uuid(),
      active: true,
    })
    .expect(201);

  return res.body.id;
};
