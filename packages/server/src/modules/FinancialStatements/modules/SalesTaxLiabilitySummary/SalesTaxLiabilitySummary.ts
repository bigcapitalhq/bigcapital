import * as R from 'ramda';
import { isEmpty, sumBy } from 'lodash';
import {
  SalesTaxLiabilitySummaryQuery,
  SalesTaxLiabilitySummaryRate,
  SalesTaxLiabilitySummaryReportData,
  SalesTaxLiabilitySummaryTotal,
} from './SalesTaxLiability.types';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ModelObject } from 'objection';
import { TaxRateModel } from '@/modules/TaxRates/models/TaxRate.model';
import { SalesTaxLiabilitySummaryRepository } from './SalesTaxLiabilitySummaryRepository';

export class SalesTaxLiabilitySummary extends FinancialSheet {
  private query: SalesTaxLiabilitySummaryQuery;
  private repository: SalesTaxLiabilitySummaryRepository;

  /**
   * Sales tax liability summary constructor.
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @param {ITaxRate[]} taxRates
   * @param {SalesTaxLiabilitySummaryPayableById} payableTaxesById
   * @param {SalesTaxLiabilitySummarySalesById} salesTaxesById
   */
  constructor(
    query: SalesTaxLiabilitySummaryQuery,
    repository: SalesTaxLiabilitySummaryRepository,
  ) {
    super();

    this.query = query;
    this.repository = repository;
  }

  /**
   * Retrieves the tax rate liability node.
   * @param {ITaxRate} taxRate
   * @returns {SalesTaxLiabilitySummaryRate}
   */
  private taxRateLiability = (
    taxRate: ModelObject<TaxRateModel>,
  ): SalesTaxLiabilitySummaryRate => {
    const payableTax = this.repository.taxesPayableByTaxRateId[taxRate.id];
    const salesTax = this.repository.accountTransactionsByTaxRateId[taxRate.id];

    const payableTaxAmount = payableTax
      ? payableTax.credit - payableTax.debit
      : 0;
    const salesTaxAmount = salesTax ? salesTax.credit - salesTax.debit : 0;

    // Calculates the tax percentage.
    const taxPercentage = R.compose(
      R.unless(R.equals(0), R.divide(R.__, salesTaxAmount)),
    )(payableTaxAmount);

    // Calculates the payable tax amount.
    const collectedTaxAmount = payableTax ? payableTax.debit : 0;

    return {
      id: taxRate.id,
      taxName: `${taxRate.name} (${taxRate.rate}%)`,
      taxableAmount: this.getAmountMeta(salesTaxAmount),
      taxAmount: this.getAmountMeta(payableTaxAmount),
      taxPercentage: this.getPercentageTotalAmountMeta(taxPercentage),
      collectedTaxAmount: this.getAmountMeta(collectedTaxAmount),
    };
  };

  /**
   * Filters the non-transactions tax rates.
   * @param {SalesTaxLiabilitySummaryRate[]} nodes
   * @returns {SalesTaxLiabilitySummaryRate[]}
   */
  private filterNonTransactionsTaxRates = (
    nodes: SalesTaxLiabilitySummaryRate[],
  ): SalesTaxLiabilitySummaryRate[] => {
    return nodes.filter((node) => {
      const salesTrxs = this.repository.accountTransactionsByTaxRateId[node.id];
      const payableTrxs = this.repository.taxesPayableByTaxRateId[node.id];

      return !isEmpty(salesTrxs) || !isEmpty(payableTrxs);
    });
  };

  /**
   * Retrieves the tax rates liability nodes.
   * @returns {SalesTaxLiabilitySummaryRate[]}
   */
  private taxRatesLiability = (): SalesTaxLiabilitySummaryRate[] => {
    return R.compose(
      this.filterNonTransactionsTaxRates,
      R.map(this.taxRateLiability),
    )(this.repository.taxRates);
  };

  /**
   * Retrieves the tax rates total node.
   * @param {SalesTaxLiabilitySummaryRate[]} nodes
   * @returns {SalesTaxLiabilitySummaryTotal}
   */
  private taxRatesTotal = (
    nodes: SalesTaxLiabilitySummaryRate[],
  ): SalesTaxLiabilitySummaryTotal => {
    const taxableAmount = sumBy(nodes, 'taxableAmount.amount');
    const taxAmount = sumBy(nodes, 'taxAmount.amount');
    const collectedTaxAmount = sumBy(nodes, 'collectedTaxAmount.amount');

    return {
      taxableAmount: this.getTotalAmountMeta(taxableAmount),
      taxAmount: this.getTotalAmountMeta(taxAmount),
      collectedTaxAmount: this.getTotalAmountMeta(collectedTaxAmount),
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
