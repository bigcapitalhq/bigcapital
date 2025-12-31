import { ACCOUNT_TYPE } from '@/constants/accounts';
import {
  SalesTaxLiabilitySummaryPayableById,
  SalesTaxLiabilitySummarySalesById,
} from './SalesTaxLiability.types';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { keyBy } from 'lodash';
import { TaxRateModel } from '@/modules/TaxRates/models/TaxRate.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ItemEntryTax } from '@/modules/TaxRates/models/ItemEntryTax.model';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { ModelObject } from 'objection';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable({ scope: Scope.TRANSIENT })
export class SalesTaxLiabilitySummaryRepository {
  @Inject(TaxRateModel.name)
  private readonly taxRateModel: TenantModelProxy<typeof TaxRateModel>;

  @Inject(AccountTransaction.name)
  private readonly accountTransactionModel: TenantModelProxy<typeof AccountTransaction>;

  @Inject(Account.name)
  private readonly accountModel: TenantModelProxy<typeof Account>;

  @Inject(ItemEntryTax.name)
  private readonly itemEntryTaxModel: TenantModelProxy<typeof ItemEntryTax>;

  @Inject(ItemEntry.name)
  private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>;

  /**
   * @param {SalesTaxLiabilitySummarySalesById}
   */
  accountTransactionsByTaxRateId: SalesTaxLiabilitySummarySalesById;

  /**
   * @param {SalesTaxLiabilitySummaryPayableById}
   */
  taxesPayableByTaxRateId: SalesTaxLiabilitySummaryPayableById;

  /**
   * Taxable amounts by tax rate id from items_entries_taxes.
   */
  taxableAmountsByTaxRateId: Record<number, { taxableAmount: number; taxAmount: number }>;

  /**
   * @param {Array<ModelObject<TaxRateModel>>}
   */
  taxRates: Array<ModelObject<TaxRateModel>>;

  /**
   * Load data.
   */
  async load() {
    await this.initTaxRates();
    await this.initTaxesPayableByTaxRateId();
    await this.initAccountTransactionsByTaxRateId();
    await this.initTaxableAmountsByTaxRateId();
  }

  /**
   * Initialize tax rates.
   */
  async initTaxRates() {
    const taxRates = await this.getTaxRates();
    this.taxRates = taxRates;
  }

  /**
   * Initialize account transactions by tax rate id.
   */
  async initAccountTransactionsByTaxRateId() {
    const transactionsByTaxRateId = await this.taxesSalesSumGroupedByRateId();

    this.accountTransactionsByTaxRateId = transactionsByTaxRateId;
  }

  /**
   * Initialize taxes payable by tax rate id.
   */
  async initTaxesPayableByTaxRateId() {
    const payableTaxes = await this.getTaxesPayableSumGroupedByRateId();

    this.taxesPayableByTaxRateId = payableTaxes;
  }

  /**
   * Initialize taxable amounts by tax rate id from items_entries_taxes.
   */
  async initTaxableAmountsByTaxRateId() {
    const taxableAmounts = await this.getTaxableAmountsFromEntryTaxes();
    this.taxableAmountsByTaxRateId = taxableAmounts;
  }

  /**
   * Retrieve taxable amounts grouped by tax rate from items_entries_taxes.
   * Joins with items_entries to get the entry subtotal (taxable base).
   */
  public async getTaxableAmountsFromEntryTaxes(): Promise<Record<number, { taxableAmount: number; taxAmount: number }>> {
    const knex = this.itemEntryTaxModel().knex();

    // Query items_entries_taxes to get taxable amounts stored directly
    const results = await knex('items_entries_taxes')
      .groupBy('tax_rate_id')
      .select('tax_rate_id as taxRateId')
      .sum('tax_amount as taxAmount')
      .sum('taxable_amount as taxableAmount');

    const byTaxRateId: Record<number, { taxableAmount: number; taxAmount: number }> = {};
    for (const row of results) {
      byTaxRateId[row.taxRateId] = {
        taxableAmount: parseFloat(row.taxableAmount) || 0,
        taxAmount: parseFloat(row.taxAmount) || 0,
      };
    }
    return byTaxRateId;
  }

  /**
   * Retrieve tax rates.
   * @param {number} tenantId
   * @returns {Promise<TaxRate[]>}
   */
  public getTaxRates = () => {
    return this.taxRateModel().query().orderBy('name', 'desc');
  };

  /**
   * Retrieve taxes payable sum grouped by tax rate id.
   * @returns {Promise<SalesTaxLiabilitySummaryPayableById>}
   */
  public async getTaxesPayableSumGroupedByRateId(): Promise<SalesTaxLiabilitySummaryPayableById> {
    // Retrieves tax payable accounts.
    const taxPayableAccounts = await this.accountModel()
      .query()
      .whereIn('accountType', [ACCOUNT_TYPE.TAX_PAYABLE]);

    const payableAccountsIds = taxPayableAccounts.map((account) => account.id);

    const groupedTaxesById = await this.accountTransactionModel()
      .query()
      .whereIn('account_id', payableAccountsIds)
      .whereNot('tax_rate_id', null)
      .groupBy('tax_rate_id')
      .select(['tax_rate_id'])
      .sum('credit as credit')
      .sum('debit as debit');

    return keyBy(groupedTaxesById, 'taxRateId');
  }

  /**
   * Retrieve taxes sales sum grouped by tax rate id.
   * @returns {Promise<SalesTaxLiabilitySummarySalesById>}
   */
  public taxesSalesSumGroupedByRateId =
    async (): Promise<SalesTaxLiabilitySummarySalesById> => {
      const incomeAccounts = await this.accountModel()
        .query()
        .whereIn('accountType', [
          ACCOUNT_TYPE.INCOME,
          ACCOUNT_TYPE.OTHER_INCOME,
        ]);
      const incomeAccountsIds = incomeAccounts.map((account) => account.id);

      const groupedTaxesById = await this.accountTransactionModel()
        .query()
        .whereIn('account_id', incomeAccountsIds)
        .whereNot('tax_rate_id', null)
        .groupBy('tax_rate_id')
        .select(['tax_rate_id'])
        .sum('credit as credit')
        .sum('debit as debit');

      return keyBy(groupedTaxesById, 'taxRateId');
    };
}
