import { BalanceSheetQuery } from './BalanceSheetQuery';
import { getBalanceSheetDefaultQuery } from './constants';

describe('BalanceSheetQuery', () => {
  const baseQuery = () => getBalanceSheetDefaultQuery();

  it('enables the amount change and previous period when the percentage change is on', () => {
    const query = new BalanceSheetQuery({
      ...baseQuery(),
      previousPeriod: false,
      previousPeriodAmountChange: false,
      previousPeriodPercentageChange: true,
    });
    expect(query.query.previousPeriodAmountChange).toBe(true);
    expect(query.query.previousPeriod).toBe(true);
    expect(query.isPreviousPeriodChangeActive()).toBe(true);
    expect(query.isPreviousPeriodPercentageActive()).toBe(true);
    expect(query.isPreviousPeriodActive()).toBe(true);
  });

  it('enables the amount change and previous year when the percentage change is on', () => {
    const query = new BalanceSheetQuery({
      ...baseQuery(),
      previousYear: false,
      previousYearAmountChange: false,
      previousYearPercentageChange: true,
    });
    expect(query.query.previousYearAmountChange).toBe(true);
    expect(query.query.previousYear).toBe(true);
    expect(query.isPreviousYearChangeActive()).toBe(true);
    expect(query.isPreviousYearPercentageActive()).toBe(true);
    expect(query.isPreviousYearActive()).toBe(true);
  });

  it('enables the previous period and year when the amount change is on', () => {
    const query = new BalanceSheetQuery({
      ...baseQuery(),
      previousPeriod: false,
      previousPeriodAmountChange: true,
      previousYear: false,
      previousYearAmountChange: true,
    });
    expect(query.query.previousPeriod).toBe(true);
    expect(query.query.previousYear).toBe(true);
  });

  it('keeps the comparison flags disabled by default', () => {
    const query = new BalanceSheetQuery(baseQuery());
    expect(query.query.previousPeriod).toBe(false);
    expect(query.query.previousPeriodAmountChange).toBe(false);
    expect(query.query.previousPeriodPercentageChange).toBe(false);
    expect(query.query.previousYear).toBe(false);
    expect(query.query.previousYearAmountChange).toBe(false);
    expect(query.query.previousYearPercentageChange).toBe(false);
  });
});
