import { AccountNormal } from '@/interfaces/Account';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { CustomerGLEntries } from './CustomerGLEntries';
import { Customer } from './models/Customer';

const AR_ACCOUNT_ID = 100;
const INCOME_ACCOUNT_ID = 500;

const buildCustomer = (overrides: Partial<Customer> = {}): Customer =>
  ({
    id: 1,
    currencyCode: 'USD',
    openingBalance: 500,
    localOpeningBalance: 500,
    openingBalanceExchangeRate: 1,
    openingBalanceAt: '2024-01-01',
    openingBalanceBranchId: 3,
    ...overrides,
  }) as unknown as Customer;

const findEntry = (entries: any[], accountId: number) =>
  entries.find((entry) => entry.accountId === accountId);

describe('CustomerGLEntries', () => {
  const customerGLEntries = new CustomerGLEntries();

  const buildEntries = (overrides: Partial<Customer> = {}) =>
    customerGLEntries.getCustomerOpeningGLEntries(
      AR_ACCOUNT_ID,
      INCOME_ACCOUNT_ID,
      buildCustomer(overrides),
    );

  it('posts the opening balance as Dr A/R and Cr income', () => {
    const entries = buildEntries();

    expect(entries).toHaveLength(2);

    const receivableEntry = findEntry(entries, AR_ACCOUNT_ID);
    expect(receivableEntry.debit).toBe(500);
    expect(receivableEntry.credit).toBe(0);
    expect(receivableEntry.accountNormal).toBe(AccountNormal.DEBIT);

    const incomeEntry = findEntry(entries, INCOME_ACCOUNT_ID);
    expect(incomeEntry.credit).toBe(500);
    expect(incomeEntry.debit).toBe(0);
    expect(incomeEntry.accountNormal).toBe(AccountNormal.CREDIT);
  });

  it('flags every opening balance entry as accrual', () => {
    const entries = buildEntries();

    entries.forEach((entry) => {
      expect(entry.basis).toBe(AccountingBasis.Accrual);
    });
  });

  it('carries the customer opening balance metadata on both entries', () => {
    const customer = buildCustomer({ id: 7 });
    const entries = customerGLEntries.getCustomerOpeningGLEntries(
      AR_ACCOUNT_ID,
      INCOME_ACCOUNT_ID,
      customer,
    );

    entries.forEach((entry) => {
      expect(entry.transactionType).toBe('CustomerOpeningBalance');
      expect(entry.transactionId).toBe(customer.id);
      expect(entry.contactId).toBe(customer.id);
      expect(entry.date).toBe(customer.openingBalanceAt);
      expect(entry.branchId).toBe(customer.openingBalanceBranchId);
      expect(entry.currencyCode).toBe(customer.currencyCode);
      expect(entry.exchangeRate).toBe(customer.openingBalanceExchangeRate);
    });
  });

  it('keeps the opening balance ledger balanced in the foreign currency', () => {
    const entries = buildEntries({
      openingBalance: 500,
      localOpeningBalance: 600,
      openingBalanceExchangeRate: 1.2,
    });

    const totalDebit = entries.reduce((total, entry) => total + entry.debit, 0);
    const totalCredit = entries.reduce(
      (total, entry) => total + entry.credit,
      0,
    );

    expect(totalDebit).toBe(600);
    expect(totalCredit).toBe(600);
  });
});
