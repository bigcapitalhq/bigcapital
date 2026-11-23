import {
  getMonthsKeys,
  getPeriodKey,
  getPeriodLabel,
  mergeQueryWithDefaults,
} from './utils';

describe('BudgetVsActualQuery', () => {
  it('applies the default query values', () => {
    const query = mergeQueryWithDefaults({ budgetId: 1 } as any);

    expect(query.displayColumnsBy).toEqual('month');
    expect(query.numberFormat).toBeDefined();
    expect(query.numberFormat.precision).toEqual(2);
    expect(query.branchesIds).toEqual([]);
    expect(query.accountsIds).toEqual([]);
  });

  it('keeps the given query values over the defaults', () => {
    const query = mergeQueryWithDefaults({
      budgetId: 1,
      displayColumnsBy: 'year',
      fromDate: '2024-01-01',
      toDate: '2024-12-31',
    } as any);

    expect(query.displayColumnsBy).toEqual('year');
    expect(query.fromDate).toEqual('2024-01-01');
    expect(query.toDate).toEqual('2024-12-31');
  });

  it('retrieves the period keys based on the display columns type', () => {
    expect(getPeriodKey('2024-02-01', 'month')).toEqual('2024-02');
    expect(getPeriodKey('2024-02-01', 'quarter')).toEqual('2024-Q1');
    expect(getPeriodKey('2024-02-01', 'year')).toEqual('2024');
  });

  it('retrieves the period labels based on the display columns type', () => {
    expect(getPeriodLabel('2024-02-01', 'month')).toEqual('Feb 2024');
    expect(getPeriodLabel('2024-02-01', 'quarter')).toEqual('Q1 2024');
    expect(getPeriodLabel('2024-02-01', 'year')).toEqual('2024');
  });

  it('retrieves the months keys of the given date range', () => {
    expect(getMonthsKeys('2024-01-01', '2024-03-31')).toEqual([
      '2024-01',
      '2024-02',
      '2024-03',
    ]);
    expect(getMonthsKeys('2024-01-01', '2024-12-31')).toHaveLength(12);
  });
});
