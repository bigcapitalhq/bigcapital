import { AccountNormal } from '@/interfaces/Account';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { SaleInvoiceWriteoffGL } from './SaleInvoiceWriteoffGL';

const AR_ACCOUNT_ID = 10007;
const BAD_DEBT_ACCOUNT_ID = 1024;

const buildSaleInvoice = (overrides: Record<string, any> = {}) =>
  ({
    id: 1,
    invoiceDate: '2023-01-01',
    currencyCode: 'USD',
    exchangeRate: 1,
    invoiceNo: 'INV-100',
    referenceNo: 'REF-1',
    branchId: 1,
    customerId: 5,
    writtenoffAmountLocal: 1000,
    writtenoffExpenseAccountId: BAD_DEBT_ACCOUNT_ID,
    writtenoffExpenseAccount: { accountNormal: AccountNormal.DEBIT },
    ...overrides,
  }) as any;

const buildLedger = (saleInvoice: any) =>
  new SaleInvoiceWriteoffGL(saleInvoice)
    .setARAccountId(AR_ACCOUNT_ID)
    .getInvoiceWriteoffLedger();

describe('SaleInvoiceWriteoffGL', () => {
  it('credits the receivable and debits the bad debt expense', () => {
    const entries = buildLedger(buildSaleInvoice()).getEntries();

    const receivableEntry = entries.find(
      (entry) => entry.accountId === AR_ACCOUNT_ID,
    );
    const expenseEntry = entries.find(
      (entry) => entry.accountId === BAD_DEBT_ACCOUNT_ID,
    );

    expect(receivableEntry.credit).toBe(1000);
    expect(receivableEntry.debit).toBe(0);
    expect(receivableEntry.contactId).toBe(5);

    expect(expenseEntry.debit).toBe(1000);
    expect(expenseEntry.credit).toBe(0);
  });

  it('flags every ledger entry as accrual basis', () => {
    const entries = buildLedger(buildSaleInvoice()).getEntries();

    expect(entries).toHaveLength(2);
    expect(
      entries.every((entry) => entry.basis === AccountingBasis.Accrual),
    ).toBe(true);
  });
});
