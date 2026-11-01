import { AccountNormal } from '@/interfaces/Account';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { VendorGLEntries } from './VendorGLEntries';
import { Vendor } from './models/Vendor';

const AP_ACCOUNT_ID = 200;
const EXPENSE_ACCOUNT_ID = 600;

const buildVendor = (overrides: Partial<Vendor> = {}): Vendor =>
  ({
    id: 1,
    currencyCode: 'USD',
    openingBalance: 500,
    localOpeningBalance: 500,
    openingBalanceExchangeRate: 1,
    openingBalanceAt: '2024-01-01',
    openingBalanceBranchId: 3,
    ...overrides,
  }) as unknown as Vendor;

const findEntry = (entries: any[], accountId: number) =>
  entries.find((entry) => entry.accountId === accountId);

describe('VendorGLEntries', () => {
  const vendorGLEntries = new VendorGLEntries();

  const buildEntries = (overrides: Partial<Vendor> = {}) =>
    vendorGLEntries.getOpeningBalanceGLEntries(
      AP_ACCOUNT_ID,
      EXPENSE_ACCOUNT_ID,
      buildVendor(overrides),
    );

  it('posts the opening balance as Dr expense and Cr A/P', () => {
    const entries = buildEntries();

    expect(entries).toHaveLength(2);

    const expenseEntry = findEntry(entries, EXPENSE_ACCOUNT_ID);
    expect(expenseEntry.debit).toBe(500);
    expect(expenseEntry.credit).toBe(0);
    expect(expenseEntry.accountNormal).toBe(AccountNormal.DEBIT);

    const payableEntry = findEntry(entries, AP_ACCOUNT_ID);
    expect(payableEntry.credit).toBe(500);
    expect(payableEntry.debit).toBe(0);
    expect(payableEntry.accountNormal).toBe(AccountNormal.CREDIT);
  });

  it('flags every opening balance entry as accrual', () => {
    const entries = buildEntries();

    entries.forEach((entry) => {
      expect(entry.basis).toBe(AccountingBasis.Accrual);
    });
  });

  it('carries the vendor opening balance metadata on both entries', () => {
    const vendor = buildVendor({ id: 7 });
    const entries = vendorGLEntries.getOpeningBalanceGLEntries(
      AP_ACCOUNT_ID,
      EXPENSE_ACCOUNT_ID,
      vendor,
    );

    entries.forEach((entry) => {
      expect(entry.transactionType).toBe('VendorOpeningBalance');
      expect(entry.transactionId).toBe(vendor.id);
      expect(entry.contactId).toBe(vendor.id);
      expect(entry.date).toBe(vendor.openingBalanceAt);
      expect(entry.branchId).toBe(vendor.openingBalanceBranchId);
      expect(entry.currencyCode).toBe(vendor.currencyCode);
      expect(entry.exchangeRate).toBe(vendor.openingBalanceExchangeRate);
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
