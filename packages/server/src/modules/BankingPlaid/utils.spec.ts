import { transformPlaidTrxsToCashflowCreate } from './utils';

const buildPlaidTransaction = (overrides: Record<string, any> = {}) =>
  ({
    date: '2026-10-24',
    amount: 10,
    name: 'Test transaction',
    iso_currency_code: 'USD',
    transaction_id: 'plaid-transaction-id',
    pending: false,
    pending_transaction_id: null,
    payment_meta: null,
    ...overrides,
  }) as any;

describe('transformPlaidTrxsToCashflowCreate', () => {
  it('keeps the full transaction name as the description', () => {
    const name = 'A'.repeat(300);
    const transaction = transformPlaidTrxsToCashflowCreate(
      1,
      buildPlaidTransaction({ name }),
    );

    expect(transaction.description).toBe(name);
  });

  it('does not throw when the Plaid name is missing', () => {
    const transaction = transformPlaidTrxsToCashflowCreate(
      1,
      buildPlaidTransaction({ name: undefined }),
    );

    expect(transaction.description).toBeUndefined();
  });

  it('truncates the payee to the column length', () => {
    const payee = 'P'.repeat(260);
    const transaction = transformPlaidTrxsToCashflowCreate(
      1,
      buildPlaidTransaction({ payment_meta: { payee } }),
    );

    expect(transaction.payee).toBe('P'.repeat(255));
  });

  it('truncates the reference number to the column length', () => {
    const referenceNumber = '1'.repeat(260);
    const transaction = transformPlaidTrxsToCashflowCreate(
      1,
      buildPlaidTransaction({
        payment_meta: { reference_number: referenceNumber },
      }),
    );

    expect(transaction.referenceNo).toBe('1'.repeat(255));
  });

  it('keeps short payee and reference number unchanged', () => {
    const transaction = transformPlaidTrxsToCashflowCreate(
      1,
      buildPlaidTransaction({
        payment_meta: { payee: 'Acme Corp', reference_number: 'REF-001' },
      }),
    );

    expect(transaction.payee).toBe('Acme Corp');
    expect(transaction.referenceNo).toBe('REF-001');
  });

  it('handles missing payment metadata', () => {
    const transaction = transformPlaidTrxsToCashflowCreate(
      1,
      buildPlaidTransaction({ payment_meta: null }),
    );

    expect(transaction.payee).toBeUndefined();
    expect(transaction.referenceNo).toBeUndefined();
  });
});
