import { ITaxRate } from '@/interfaces';
import {
  SalesTaxLiabilitySummaryQuery,
  SalesTaxLiabilitySummaryRate,
  SalesTaxLiabilitySummaryReportData,
  SalesTaxLiabilitySummaryTotal,
} from '@/interfaces/SalesTaxLiabilitySummary';
import { sumBy } from 'lodash';
import FinancialSheet from '../FinancialSheet';

export class SalesTaxLiabilitySummary extends FinancialSheet {
  query: SalesTaxLiabilitySummaryQuery;
  taxRates: ITaxRate[];
  payableTaxesById: any;
  salesTaxesById: any;

  /**
   * Sales tax liability summary constructor.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @param {ITaxRate[]} taxRates
   * @param payableTaxesById
   * @param salesTaxesById
   */
  constructor(
    query: SalesTaxLiabilitySummaryQuery,
    taxRates: ITaxRate[],
    payableTaxesById: Record<
      string,
      { taxRateId: number; credit: number; debit: number }
    >,
    salesTaxesById: Record<
      string,
      { taxRateId: number; credit: number; debit: number }
    >
  ) {
    super();

    this.query = query;
    this.taxRates = taxRates;
    this.payableTaxesById = payableTaxesById;
    this.salesTaxesById = salesTaxesById;
  }

  /**
   * Retrieves the tax rate liability node.
   * @param {ITaxRate} taxRate
   * @returns {SalesTaxLiabilitySummaryRate}
   */
  private taxRateLiability = (
    taxRate: ITaxRate
  ): SalesTaxLiabilitySummaryRate => {
    return {
      taxName: taxRate.name,
      taxCode: taxRate.code,
      taxableAmount: this.getAmountMeta(0),
      taxAmount: this.getAmountMeta(0),
    };
  };

  /**
   * Retrieves the tax rates liability nodes.
   * @returns {SalesTaxLiabilitySummaryRate[]}
   */
  private taxRatesLiability = (): SalesTaxLiabilitySummaryRate[] => {
    return this.taxRates.map(this.taxRateLiability);
  };

  /**
   * Retrieves the tax rates total node.
   * @param {SalesTaxLiabilitySummaryRate[]} nodes
   * @returns {SalesTaxLiabilitySummaryTotal}
   */
  private taxRatesTotal = (
    nodes: SalesTaxLiabilitySummaryRate[]
  ): SalesTaxLiabilitySummaryTotal => {
    const taxableAmount = sumBy(nodes, 'taxableAmount.total');
    const taxAmount = sumBy(nodes, 'taxAmount.total');

    return {
      taxableAmount: this.getTotalAmountMeta(taxableAmount),
      taxAmount: this.getTotalAmountMeta(taxAmount),
    };
  };

  /**
   * Retrieves the report data.
   * @returns {SalesTaxLiabilitySummaryReportData}
   */
  public reportData = (): SalesTaxLiabilitySummaryReportData => {
    const taxRates = this.taxRatesLiability();
    const total = this.taxRatesTotal(taxRates);

    return { taxRates, total };
  };
}
