import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { BillGL } from './BillsGL';

const buildBill = (overrides: Record<string, any> = {}) =>
  ({
    id: 1,
    exchangeRate: 1,
    currencyCode: 'USD',
    userId: 1,
    referenceNo: 'REF-1',
    billNumber: 'B-100',
    billDate: '2023-01-01',
    branchId: 1,
    projectId: null,
    createdAt: new Date('2023-01-01'),
    discountType: 'amount',
    discount: 0,
    adjustment: 0,
    entries: [
      {
        id: 1,
        itemId: 10,
        totalExcludingTax: 1000,
        costAccountId: null,
        item: { type: 'inventory', inventoryAccountId: 100 },
      },
      {
        id: 2,
        itemId: 11,
        totalExcludingTax: 500,
        costAccountId: 200,
        item: { type: 'service' },
      },
    ],
    ...overrides,
  }) as any;

const buildLedger = (
  bill: any,
  itemAllocatedCosts: any[] = [],
  landedCostLedgerEntries: any[] = [],
) =>
  new BillGL(bill, itemAllocatedCosts, landedCostLedgerEntries)
    .setPayableAccountId(1)
    .setTaxPayableAccountId(2)
    .setPurchaseDiscountAccountId(3)
    .setOtherExpensesAccountId(4)
    .getBillLedger();

describe('BillGL', () => {
  it('adds the allocated landed costs to the item entries debit', () => {
    const ledger = buildLedger(buildBill(), [{ entryId: 1, amount: 100 }], []);

    const entries = ledger.getEntries();
    const itemEntryOne = entries.find((entry) => entry.itemId === 10);
    const itemEntryTwo = entries.find((entry) => entry.itemId === 11);

    expect(itemEntryOne.debit).toBe(1100);
    expect(itemEntryOne.accountId).toBe(100);
    expect(itemEntryOne.indexGroup).toBe(10);
    expect(itemEntryOne.accountNormal).toBe(AccountNormal.DEBIT);

    expect(itemEntryTwo.debit).toBe(500);
    expect(itemEntryTwo.accountId).toBe(200);
  });

  it('appends the landed costs as credit ledger entries', () => {
    const ledger = buildLedger(
      buildBill(),
      [],
      [{ amount: 50, costAccountId: 300 }],
    );

    const entries = ledger.getEntries();
    const landedCostEntry = entries.find((entry) => entry.accountId === 300);

    expect(landedCostEntry.credit).toBe(50);
    expect(landedCostEntry.indexGroup).toBe(20);
    expect(landedCostEntry.accountNormal).toBe(AccountNormal.DEBIT);
  });

  it('keeps the bill entries amounts when there are no contributions', () => {
    const ledger = buildLedger(buildBill());

    const entries = ledger.getEntries();
    const itemEntryOne = entries.find((entry) => entry.itemId === 10);

    expect(itemEntryOne.debit).toBe(1000);
    expect(entries.some((entry) => entry.accountId === 300)).toBe(false);
  });

  it('applies the exchange rate to the item entries but keeps the allocated costs as is', () => {
    const ledger = buildLedger(
      buildBill({ exchangeRate: 2 }),
      [{ entryId: 1, amount: 100 }],
      [],
    );

    const entries = ledger.getEntries();
    const itemEntryOne = entries.find((entry) => entry.itemId === 10);

    expect(itemEntryOne.debit).toBe(2100);
  });
});
