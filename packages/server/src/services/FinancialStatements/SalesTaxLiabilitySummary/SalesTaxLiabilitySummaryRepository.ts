import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import {
  SalesTaxLiabilitySummaryPayableById,
  SalesTaxLiabilitySummarySalesById,
} from '@/interfaces/SalesTaxLiabilitySummary';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { keyBy } from 'lodash';
import { Inject, Service } from 'typedi';

@Service()
export class SalesTaxLiabilitySummaryRepository {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve tax rates.
   * @param {number} tenantId
   * @returns {Promise<TaxRate[]>}
   */
  public taxRates = (tenantId: number) => {
    const { TaxRate } = this.tenancy.models(tenantId);

    return TaxRate.query().orderBy('name', 'desc');
  };

  /**
   * Retrieve taxes payable sum grouped by tax rate id.
   * @param {number} tenantId
   * @returns {Promise<SalesTaxLiabilitySummaryPayableById>}
   */
  public async taxesPayableSumGroupedByRateId(
    tenantId: number
  ): Promise<SalesTaxLiabilitySummaryPayableById> {
    const { AccountTransaction, Account } = this.tenancy.models(tenantId);

    // Retrieves tax payable accounts.
    const taxPayableAccounts = await Account.query().whereIn('accountType', [
      ACCOUNT_TYPE.TAX_PAYABLE,
    ]);
    const payableAccountsIds = taxPayableAccounts.map((account) => account.id);

    const groupedTaxesById = await AccountTransaction.query()
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
   * @param {number} tenantId
   * @returns {Promise<SalesTaxLiabilitySummarySalesById>}
   */
  public taxesSalesSumGroupedByRateId = async (
    tenantId: number
  ): Promise<SalesTaxLiabilitySummarySalesById> => {
    const { AccountTransaction, Account } = this.tenancy.models(tenantId);

    const incomeAccounts = await Account.query().whereIn('accountType', [
      ACCOUNT_TYPE.INCOME,
      ACCOUNT_TYPE.OTHER_INCOME,
    ]);
    const incomeAccountsIds = incomeAccounts.map((account) => account.id);

    const groupedTaxesById = await AccountTransaction.query()
      .whereIn('account_id', incomeAccountsIds)
      .whereNot('tax_rate_id', null)
      .groupBy('tax_rate_id')
      .select(['tax_rate_id'])
      .sum('credit as credit')
      .sum('debit as debit');

    return keyBy(groupedTaxesById, 'taxRateId');
  };
}
