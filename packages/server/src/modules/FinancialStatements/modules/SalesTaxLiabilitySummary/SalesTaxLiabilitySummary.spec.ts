import { SalesTaxLiabilitySummary } from './SalesTaxLiabilitySummary';
import { SalesTaxLiabilitySummaryRepository } from './SalesTaxLiabilitySummaryRepository';
import {
  SalesTaxLiabilitySummaryPayableById,
  SalesTaxLiabilitySummaryQuery,
  SalesTaxLiabilitySummarySalesById,
} from './SalesTaxLiability.types';

const query: SalesTaxLiabilitySummaryQuery = {
  fromDate: '2026-01-01',
  toDate: '2026-01-31',
  basis: 'accrual',
  numberFormat: {},
};

const createSummary = ({
  payable = {},
  sales = {},
}: {
  payable?: SalesTaxLiabilitySummaryPayableById;
  sales?: SalesTaxLiabilitySummarySalesById;
}) => {
  const repository = {
    taxRates: [{ id: 1, name: 'Tax', rate: 10 }],
    taxesPayableByTaxRateId: payable,
    accountTransactionsByTaxRateId: sales,
  } as unknown as SalesTaxLiabilitySummaryRepository;

  return new SalesTaxLiabilitySummary(query, repository, {
    baseCurrency: 'USD',
    dateFormat: 'YYYY MMM DD',
  });
};

describe('SalesTaxLiabilitySummary', () => {
  it('calculates the tax percentage from the payable tax over the taxable sales', () => {
    const summary = createSummary({
      payable: { 1: { taxRateId: 1, credit: 100, debit: 0 } },
      sales: { 1: { taxRateId: 1, credit: 1000, debit: 0 } },
    });

    const [taxRate] = summary.reportData().taxRates;

    expect(taxRate.taxPercentage.amount).toBe(0.1);
    expect(taxRate.taxPercentage.formattedAmount).toBe('%10.00');
  });

  it('returns a zero percentage when the taxable sales are zero', () => {
    const summary = createSummary({
      payable: { 1: { taxRateId: 1, credit: 100, debit: 0 } },
    });

    const [taxRate] = summary.reportData().taxRates;

    expect(taxRate.taxPercentage.amount).toBe(0);
    expect(taxRate.taxPercentage.formattedAmount).not.toContain('NaN');
  });

  it('returns a zero percentage when the taxable sales and payable tax are negative', () => {
    const summary = createSummary({
      payable: { 1: { taxRateId: 1, credit: 0, debit: 100 } },
    });

    const [taxRate] = summary.reportData().taxRates;

    expect(taxRate.taxPercentage.amount).toBe(0);
    expect(taxRate.taxPercentage.formattedAmount).not.toContain('NaN');
  });

  it('returns a zero percentage when there are no transactions', () => {
    const summary = createSummary({
      sales: { 1: { taxRateId: 1, credit: 0, debit: 0 } },
    });

    const [taxRate] = summary.reportData().taxRates;

    expect(taxRate.taxPercentage.amount).toBe(0);
    expect(taxRate.taxPercentage.formattedAmount).not.toContain('NaN');
  });
});
