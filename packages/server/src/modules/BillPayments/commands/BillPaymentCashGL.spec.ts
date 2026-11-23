import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { sumBy } from 'lodash';
import { BillPaymentCashGL } from './BillPaymentCashGL';

const buildBill = (overrides: Record<string, any> = {}) => ({
  exchangeRate: 1,
  totalLocal: 1000,
  discountAmountLocal: null,
  adjustmentLocal: null,
  entries: [
    {
      itemId: 10,
      totalExcludingTax: 1000,
      taxAmount: 0,
      costAccountId: 200,
      item: { type: 'service' },
    },
  ],
  ...overrides,
});

const buildBillPayment = (overrides: Record<string, any> = {}) => ({
  id: 1,
  currencyCode: 'USD',
  exchangeRate: 1,
  paymentNumber: 'PMT-100',
  reference: 'REF-100',
  paymentDate: '2023-01-01',
  createdAt: new Date('2023-01-01'),
  branchId: 1,
  paymentAccountId: 900,
  entries: [],
  ...overrides,
});

const buildLedger = (billPayment: any) =>
  new BillPaymentCashGL(billPayment)
    .setTaxPayableAccountId(1)
    .setPurchaseDiscountAccountId(2)
    .setOtherExpensesAccountId(3)
    .getLedger();

describe('BillPaymentCashGL', () => {
  it('credits the payment account and debits the bill item cost accounts', () => {
    const billPayment = buildBillPayment({
      entries: [{ paymentAmount: 1000, bill: buildBill() }],
    });
    const entries = buildLedger(billPayment).getEntries();

    const paymentEntry = entries.find((entry) => entry.accountId === 900);
    const costEntry = entries.find((entry) => entry.accountId === 200);

    expect(paymentEntry.credit).toBe(1000);
    expect(paymentEntry.accountNormal).toBe(AccountNormal.DEBIT);
    expect(paymentEntry.basis).toBe('cash');
    expect(paymentEntry.indexGroup).toBe(50);

    expect(costEntry.debit).toBe(1000);
    expect(costEntry.accountNormal).toBe(AccountNormal.DEBIT);
    expect(costEntry.itemId).toBe(10);

    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('scales the entries by the paid proportion for partial payments', () => {
    const billPayment = buildBillPayment({
      entries: [
        {
          paymentAmount: 900,
          bill: buildBill({
            totalLocal: 1800,
            discountAmountLocal: 200,
            entries: [
              {
                itemId: 10,
                totalExcludingTax: 2000,
                taxAmount: 0,
                costAccountId: 200,
                item: { type: 'service' },
              },
            ],
          }),
        },
      ],
    });
    const entries = buildLedger(billPayment).getEntries();

    const paymentEntry = entries.find((entry) => entry.accountId === 900);
    const costEntry = entries.find((entry) => entry.accountId === 200);
    const discountEntry = entries.find((entry) => entry.accountId === 2);

    expect(paymentEntry.credit).toBe(900);
    expect(costEntry.debit).toBe(1000);
    expect(discountEntry.credit).toBe(100);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('mirrors the taxes and uses the inventory account for inventory items', () => {
    const billPayment = buildBillPayment({
      entries: [
        {
          paymentAmount: 1100,
          bill: buildBill({
            totalLocal: 1100,
            entries: [
              {
                itemId: 11,
                totalExcludingTax: 1000,
                taxAmount: 100,
                costAccountId: 200,
                item: { type: 'inventory', inventoryAccountId: 300 },
              },
            ],
          }),
        },
      ],
    });
    const entries = buildLedger(billPayment).getEntries();

    const inventoryEntry = entries.find((entry) => entry.accountId === 300);
    const taxEntry = entries.find((entry) => entry.accountId === 1);

    expect(inventoryEntry.debit).toBe(1000);
    expect(taxEntry.debit).toBe(100);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('mirrors the bill adjustment sign', () => {
    const billPayment = buildBillPayment({
      entries: [
        {
          paymentAmount: 850,
          bill: buildBill({
            totalLocal: 850,
            adjustmentLocal: 50,
            entries: [
              {
                itemId: 10,
                totalExcludingTax: 800,
                taxAmount: 0,
                costAccountId: 200,
                item: { type: 'service' },
              },
            ],
          }),
        },
      ],
    });
    const entries = buildLedger(billPayment).getEntries();

    const adjustmentEntry = entries.find((entry) => entry.accountId === 3);

    expect(adjustmentEntry.debit).toBe(50);
    expect(sumBy(entries, 'debit')).toBeCloseTo(sumBy(entries, 'credit'), 2);
  });

  it('returns no entries when the paid proportion cannot be computed', () => {
    const billPayment = buildBillPayment({
      entries: [{ paymentAmount: 1000, bill: buildBill({ totalLocal: 0 }) }],
    });
    const entries = buildLedger(billPayment).getEntries();

    expect(entries).toHaveLength(0);
  });
});
