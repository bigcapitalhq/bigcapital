import { TransactionsByVendorsTable } from './TransactionsByVendorTable';
import { HtmlTableCustomCss } from './constants';

describe('TransactionsByVendorsTable', () => {
  it('keys the running balance cell like its header column', () => {
    const table = new TransactionsByVendorsTable([], {} as any, 'YYYY-MM-DD');
    const rows = table.contactTransactions({
      transactions: [
        {
          date: '2025-06-01',
          accountName: 'Accounts Payable',
          transactionType: 'bill',
          transactionNumber: '1',
          credit: { formattedAmount: '' },
          debit: { formattedAmount: '' },
          runningBalance: { formattedAmount: '100.00' },
        },
      ],
    } as any);

    expect(rows[0].cells.map((cell) => cell.key)).toContain('running_balance');
    expect(HtmlTableCustomCss).toContain('table .cell--running_balance');
  });
});
