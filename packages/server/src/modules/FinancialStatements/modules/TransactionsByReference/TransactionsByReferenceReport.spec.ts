import { AccountingBasis } from '@/common/types/AccountingBasis';
import { TransactionsByReference } from './TransactionsByReferenceReport';
import { TransactionsByReferenceQueryDto } from './TransactionsByReferenceQuery.dto';

const baseTransaction = {
  date: '2024-01-01',
  credit: 0,
  debit: 100,
  referenceType: 'SaleInvoice',
  referenceId: 1,
  referenceTypeFormatted: 'Invoice',
  contactId: 1,
  contactType: 'customer',
  accountId: 1,
  account: { id: 1, name: 'Cash', code: '1000' },
};

const buildReport = (transactions: Array<Record<string, unknown>>) =>
  new TransactionsByReference(
    transactions as any,
    {
      referenceType: 'SaleInvoice',
      referenceId: 1,
    } as TransactionsByReferenceQueryDto,
    { baseCurrency: 'USD', dateFormat: 'YYYY-MM-DD' } as any,
  );

describe('TransactionsByReference', () => {
  it('returns a null basis for general entries', () => {
    const report = buildReport([{ ...baseTransaction, basis: null }]);

    expect(report.reportData()[0].basis).toBeNull();
  });

  it.each([AccountingBasis.Cash, AccountingBasis.Accrual])(
    'keeps the %s basis',
    (basis) => {
      const report = buildReport([{ ...baseTransaction, basis }]);

      expect(report.reportData()[0].basis).toBe(basis);
    },
  );
});
