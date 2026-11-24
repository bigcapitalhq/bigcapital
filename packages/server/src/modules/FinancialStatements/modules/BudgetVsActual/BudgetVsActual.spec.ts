import { BudgetVsActual } from './BudgetVsActual';
import { BudgetVsActualRepository } from './BudgetVsActualRepository';
import { IBudgetVsActualQuery } from './BudgetVsActual.types';

describe('BudgetVsActual', () => {
  const query = {
    budgetId: 1,
    fromDate: '2024-01-01',
    toDate: '2024-01-31',
    displayColumnsBy: 'month',
  } as IBudgetVsActualQuery;

  const buildReport = (repository) => {
    const report = new BudgetVsActual(
      repository as unknown as BudgetVsActualRepository,
      query,
      {} as any,
      { baseCurrency: 'USD', dateFormat: 'YYYY MMM DD' },
    );
    return report.reportData();
  };

  it('computes the variance as actual minus the budget', () => {
    const repository = {
      accounts: [
        {
          id: 1,
          code: '4000',
          name: 'Sales',
          accountType: 'income',
          accountNormal: 'credit',
        },
      ],
      budgetEntries: [{ accountId: 1, date: '2024-01-01', amount: 150000 }],
      actualTransactions: [
        {
          accountId: 1,
          date: '2024-01',
          credit: '159000',
          debit: '0',
          account: { accountNormal: 'credit' },
        },
      ],
      periods: [{ fromDate: '2024-01-01', toDate: '2024-01-31' }],
    };
    const report = buildReport(repository);

    expect(report.accounts[0].total.budget).toEqual(150000);
    expect(report.accounts[0].total.actual).toEqual(159000);
    expect(report.accounts[0].total.variance).toEqual(9000);
    expect(report.accounts[0].total.formattedVariance).toEqual('$9,000.00');
    expect(report.accounts[0].total.percentage).toEqual(0.06);
    expect(report.accounts[0].total.formattedPercentage).toEqual('%6.00');
  });

  it('computes a negative variance when the actual is below the budget', () => {
    const repository = {
      accounts: [
        {
          id: 1,
          code: '5000',
          name: 'Expenses',
          accountType: 'expense',
          accountNormal: 'debit',
        },
      ],
      budgetEntries: [{ accountId: 1, date: '2024-01-01', amount: 150000 }],
      actualTransactions: [
        {
          accountId: 1,
          date: '2024-01',
          credit: '0',
          debit: '141000',
          account: { accountNormal: 'debit' },
        },
      ],
      periods: [{ fromDate: '2024-01-01', toDate: '2024-01-31' }],
    };
    const report = buildReport(repository);

    expect(report.accounts[0].total.actual).toEqual(141000);
    expect(report.accounts[0].total.variance).toEqual(-9000);
    expect(report.accounts[0].total.formattedVariance).toEqual('-$9,000.00');
    expect(report.accounts[0].total.percentage).toEqual(-0.06);
    expect(report.accounts[0].total.formattedPercentage).toEqual('-%6.00');
  });

  it('sums the report totals of all accounts', () => {
    const repository = {
      accounts: [
        {
          id: 1,
          code: '4000',
          name: 'Sales',
          accountType: 'income',
          accountNormal: 'credit',
        },
        {
          id: 2,
          code: '5000',
          name: 'Expenses',
          accountType: 'expense',
          accountNormal: 'debit',
        },
      ],
      budgetEntries: [
        { accountId: 1, date: '2024-01-01', amount: 150000 },
        { accountId: 2, date: '2024-01-01', amount: 50000 },
      ],
      actualTransactions: [
        {
          accountId: 1,
          date: '2024-01',
          credit: '159000',
          debit: '0',
          account: { accountNormal: 'credit' },
        },
        {
          accountId: 2,
          date: '2024-01',
          credit: '0',
          debit: '60000',
          account: { accountNormal: 'debit' },
        },
      ],
      periods: [{ fromDate: '2024-01-01', toDate: '2024-01-31' }],
    };
    const report = buildReport(repository);

    expect(report.totals.total.budget).toEqual(200000);
    expect(report.totals.total.actual).toEqual(219000);
    expect(report.totals.total.variance).toEqual(19000);
    expect(report.totals.total.percentage).toEqual(0.095);
    expect(report.totals.periods[0].variance).toEqual(19000);
  });
});
