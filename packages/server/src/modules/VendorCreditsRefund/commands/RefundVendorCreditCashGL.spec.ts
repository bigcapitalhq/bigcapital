import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { sumBy } from 'lodash';
import { RefundVendorCreditCashGL } from './RefundVendorCreditCashGL';

const buildVendorCredit = (overrides: Record<string, any> = {}) => ({
  exchangeRate: 1,
  totalLocal: 1000,
  discountAmountLocal: null,
  adjustmentLocal: null,
  vendorId: 50,
  entries: [
    {
      itemId: 10,
      totalExcludingTax: 1000,
      costAccountId: null,
      description: 'Item description',
      item: { type: 'service', costAccountId: 500 },
    },
  ],
  ...overrides,
});

const buildRefund = (overrides: Record<string, any> = {}) => ({
  id: 1,
  currencyCode: 'USD',
  exchangeRate: 1,
  amount: 1000,
  date: '2023-01-01',
  referenceNo: 'REF-1',
  description: 'Refund description',
  createdAt: new Date('2023-01-01'),
  branchId: 1,
  depositAccountId: 900,
  vendorCredit: buildVendorCredit(),
  ...overrides,
});

const buildLedger = (refund: any) =>
  new RefundVendorCreditCashGL(refund)
    .setPurchaseDiscountAccountId(2)
    .setOtherExpensesAccountId(3)
    .getLedger();

describe('RefundVendorCreditCashGL', () => {
  it('debits the deposit account and credits the expense accounts', () => {
    const refund = buildRefund();
    const entries = buildLedger(refund).getEntries();

    const depositEntry = entries.find((entry) => entry.accountId === 900);
    const expenseEntry = entries.find((entry) => entry.accountId === 500);

    expect(depositEntry.debit).toBe(1000);
    expect(depositEntry.accountNormal).toBe(AccountNormal.DEBIT);
    expect(depositEntry.basis).toBe('cash');
    expect(depositEntry.indexGroup).toBe(50);

    expect(expenseEntry.credit).toBe(1000);
    expect(expenseEntry.accountNormal).toBe(AccountNormal.DEBIT);
    expect(expenseEntry.itemId).toBe(10);

    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('scales the entries by the refunded proportion for partial refunds', () => {
    const refund = buildRefund({
      amount: 900,
      vendorCredit: buildVendorCredit({
        totalLocal: 1800,
        discountAmountLocal: 200,
        entries: [
          {
            itemId: 10,
            totalExcludingTax: 2000,
            costAccountId: null,
            description: 'Item description',
            item: { type: 'service', costAccountId: 500 },
          },
        ],
      }),
    });
    const entries = buildLedger(refund).getEntries();

    const depositEntry = entries.find((entry) => entry.accountId === 900);
    const expenseEntry = entries.find((entry) => entry.accountId === 500);
    const discountEntry = entries.find((entry) => entry.accountId === 2);

    expect(depositEntry.debit).toBe(900);
    expect(expenseEntry.credit).toBe(1000);
    expect(discountEntry.debit).toBe(100);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('mirrors the vendor credit adjustment sign', () => {
    const refund = buildRefund({
      amount: 850,
      vendorCredit: buildVendorCredit({
        totalLocal: 850,
        adjustmentLocal: 50,
        entries: [
          {
            itemId: 10,
            totalExcludingTax: 800,
            costAccountId: null,
            description: 'Item description',
            item: { type: 'service', costAccountId: 500 },
          },
        ],
      }),
    });
    const entries = buildLedger(refund).getEntries();

    const adjustmentEntry = entries.find((entry) => entry.accountId === 3);

    expect(adjustmentEntry.credit).toBe(50);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('mirrors multiple items and prefers the entry-level cost account', () => {
    const refund = buildRefund({
      vendorCredit: buildVendorCredit({
        entries: [
          {
            itemId: 10,
            totalExcludingTax: 600,
            costAccountId: 501,
            description: 'Item one',
            item: { type: 'service', costAccountId: 500 },
          },
          {
            itemId: 11,
            totalExcludingTax: 400,
            costAccountId: null,
            description: 'Item two',
            item: { type: 'service', costAccountId: 502 },
          },
        ],
      }),
    });
    const entries = buildLedger(refund).getEntries();

    expect(entries.find((entry) => entry.itemId === 10).accountId).toBe(501);
    expect(entries.find((entry) => entry.itemId === 11).accountId).toBe(502);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('uses the inventory account for inventory items', () => {
    const refund = buildRefund({
      vendorCredit: buildVendorCredit({
        entries: [
          {
            itemId: 10,
            totalExcludingTax: 1000,
            costAccountId: 501,
            description: 'Inventory item',
            item: {
              type: 'inventory',
              inventoryAccountId: 600,
              costAccountId: 500,
            },
          },
        ],
      }),
    });
    const entries = buildLedger(refund).getEntries();

    const inventoryEntry = entries.find((entry) => entry.itemId === 10);
    expect(inventoryEntry.accountId).toBe(600);
  });

  it('converts the multi-currency refund amount using the credit exchange rate', () => {
    const refund = buildRefund({
      exchangeRate: 1,
      amount: 1000,
      vendorCredit: buildVendorCredit({
        exchangeRate: 1.2,
        totalLocal: 1200,
      }),
    });
    const entries = buildLedger(refund).getEntries();

    const depositEntry = entries.find((entry) => entry.accountId === 900);
    const expenseEntry = entries.find((entry) => entry.accountId === 500);

    expect(depositEntry.debit).toBe(1200);
    expect(expenseEntry.credit).toBe(1200);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('returns no entries when the refunded proportion cannot be computed', () => {
    const refund = buildRefund({
      vendorCredit: buildVendorCredit({ totalLocal: 0 }),
    });
    const entries = buildLedger(refund).getEntries();

    expect(entries).toHaveLength(0);
  });
});
