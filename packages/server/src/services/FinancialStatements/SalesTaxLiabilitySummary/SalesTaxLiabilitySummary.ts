import { ITaxRate } from '@/interfaces';
import {
  SalesTaxLiabilitySummaryPayableById,
  SalesTaxLiabilitySummaryQuery,
  SalesTaxLiabilitySummaryRate,
  SalesTaxLiabilitySummaryReportData,
  SalesTaxLiabilitySummarySalesById,
  SalesTaxLiabilitySummaryTotal,
} from '@/interfaces/SalesTaxLiabilitySummary';
import { sumBy } from 'lodash';
import FinancialSheet from '../FinancialSheet';

export class SalesTaxLiabilitySummary extends FinancialSheet {
  private query: SalesTaxLiabilitySummaryQuery;
  private taxRates: ITaxRate[];
  private payableTaxesById: SalesTaxLiabilitySummaryPayableById;
  private salesTaxesById: SalesTaxLiabilitySummarySalesById;

  /**
   * Sales tax liability summary constructor.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @param {ITaxRate[]} taxRates
   * @param {SalesTaxLiabilitySummaryPayableById} payableTaxesById
   * @param {SalesTaxLiabilitySummarySalesById} salesTaxesById
   */
  constructor(
    query: SalesTaxLiabilitySummaryQuery,
    taxRates: ITaxRate[],
    payableTaxesById: SalesTaxLiabilitySummaryPayableById,
    salesTaxesById: SalesTaxLiabilitySummarySalesById
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
    const payableTax = this.payableTaxesById[taxRate.id];
    const salesTax = this.salesTaxesById[taxRate.id];

    const payableTaxAmount = payableTax
      ? payableTax.credit - payableTax.debit
      : 0;
    const salesTaxAmount = salesTax ? salesTax.credit - salesTax.debit : 0;

    return {
      taxName: taxRate.name,
      taxCode: taxRate.code,
      taxableAmount: this.getAmountMeta(salesTaxAmount),
      taxAmount: this.getAmountMeta(payableTaxAmount),
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
    const taxableAmount = sumBy(nodes, 'taxableAmount.amount');
    const taxAmount = sumBy(nodes, 'taxAmount.amount');

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
