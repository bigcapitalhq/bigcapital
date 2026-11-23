import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { sumBy } from 'lodash';
import { RefundCreditNoteCashGL } from './RefundCreditNoteCashGL';

const buildCreditNote = (overrides: Record<string, any> = {}) => ({
  exchangeRate: 1,
  totalLocal: 1000,
  discountAmountLocal: null,
  adjustmentLocal: null,
  customerId: 50,
  entries: [
    {
      itemId: 10,
      totalExcludingTax: 1000,
      sellAccountId: null,
      description: 'Item description',
      item: { sellAccountId: 500 },
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
  fromAccountId: 900,
  creditNote: buildCreditNote(),
  ...overrides,
});

const buildLedger = (refund: any) =>
  new RefundCreditNoteCashGL(refund)
    .setDiscountAccountId(2)
    .setAdjustmentAccountId(3)
    .getLedger();

describe('RefundCreditNoteCashGL', () => {
  it('credits the withdrawal account and debits the income accounts', () => {
    const refund = buildRefund();
    const entries = buildLedger(refund).getEntries();

    const withdrawalEntry = entries.find((entry) => entry.accountId === 900);
    const incomeEntry = entries.find((entry) => entry.accountId === 500);

    expect(withdrawalEntry.credit).toBe(1000);
    expect(withdrawalEntry.accountNormal).toBe(AccountNormal.DEBIT);
    expect(withdrawalEntry.basis).toBe('cash');
    expect(withdrawalEntry.indexGroup).toBe(50);

    expect(incomeEntry.debit).toBe(1000);
    expect(incomeEntry.accountNormal).toBe(AccountNormal.CREDIT);
    expect(incomeEntry.itemId).toBe(10);

    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('scales the entries by the refunded proportion for partial refunds', () => {
    const refund = buildRefund({
      amount: 900,
      creditNote: buildCreditNote({
        totalLocal: 1800,
        discountAmountLocal: 200,
        entries: [
          {
            itemId: 10,
            totalExcludingTax: 2000,
            sellAccountId: null,
            description: 'Item description',
            item: { sellAccountId: 500 },
          },
        ],
      }),
    });
    const entries = buildLedger(refund).getEntries();

    const withdrawalEntry = entries.find((entry) => entry.accountId === 900);
    const incomeEntry = entries.find((entry) => entry.accountId === 500);
    const discountEntry = entries.find((entry) => entry.accountId === 2);

    expect(withdrawalEntry.credit).toBe(900);
    expect(incomeEntry.debit).toBe(1000);
    expect(discountEntry.credit).toBe(100);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('mirrors the credit note adjustment sign', () => {
    const refund = buildRefund({
      amount: 850,
      creditNote: buildCreditNote({
        totalLocal: 850,
        adjustmentLocal: 50,
        entries: [
          {
            itemId: 10,
            totalExcludingTax: 800,
            sellAccountId: null,
            description: 'Item description',
            item: { sellAccountId: 500 },
          },
        ],
      }),
    });
    const entries = buildLedger(refund).getEntries();

    const adjustmentEntry = entries.find((entry) => entry.accountId === 3);

    expect(adjustmentEntry.debit).toBe(50);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('mirrors multiple items and prefers the entry-level income account', () => {
    const refund = buildRefund({
      creditNote: buildCreditNote({
        entries: [
          {
            itemId: 10,
            totalExcludingTax: 600,
            sellAccountId: 501,
            description: 'Item one',
            item: { sellAccountId: 500 },
          },
          {
            itemId: 11,
            totalExcludingTax: 400,
            sellAccountId: null,
            description: 'Item two',
            item: { sellAccountId: 502 },
          },
        ],
      }),
    });
    const entries = buildLedger(refund).getEntries();

    expect(entries.find((entry) => entry.itemId === 10).accountId).toBe(501);
    expect(entries.find((entry) => entry.itemId === 11).accountId).toBe(502);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('returns no entries when the refunded proportion cannot be computed', () => {
    const refund = buildRefund({
      creditNote: buildCreditNote({ totalLocal: 0 }),
    });
    const entries = buildLedger(refund).getEntries();

    expect(entries).toHaveLength(0);
  });
});
