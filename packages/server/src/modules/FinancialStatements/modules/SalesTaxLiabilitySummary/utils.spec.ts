import * as moment from 'moment';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';
import { mergeSalesTaxLiabilityQueryWithDefaults } from './utils';

describe('mergeSalesTaxLiabilityQueryWithDefaults', () => {
  it('fills the missing dates with the current month range', () => {
    const query = mergeSalesTaxLiabilityQueryWithDefaults(
      {} as SalesTaxLiabilitySummaryQuery,
    );

    expect(
      moment(query.fromDate).isSame(moment().startOf('month'), 'day'),
    ).toBe(true);
    expect(moment(query.toDate).isSame(moment(), 'day')).toBe(true);
    expect(query.basis).toBe('cash');
  });

  it('keeps the explicit query values', () => {
    const query = mergeSalesTaxLiabilityQueryWithDefaults({
      fromDate: '2025-01-01',
      toDate: '2025-03-31',
      basis: 'accrual',
    });

    expect(query.fromDate).toBe('2025-01-01');
    expect(query.toDate).toBe('2025-03-31');
    expect(query.basis).toBe('accrual');
  });
});
