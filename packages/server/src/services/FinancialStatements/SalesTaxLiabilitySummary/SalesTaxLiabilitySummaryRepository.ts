import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { keyBy } from 'lodash';
import { Inject, Service } from 'typedi';

@Service()
export class SalesTaxLiabilitySummaryRepository {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve tax rates.
   * @param tenantId
   * @returns
   */
  public taxRates = (tenantId: number) => {
    const { TaxRate } = this.tenancy.models(tenantId);

    return TaxRate.query().orderBy('name', 'desc');
  };

  /**
   * Retrieve taxes payable sum grouped by tax rate id.
   * @param {number} tenantId
   * @returns
   */
  public async taxesPayableSumGroupedByRateId(
    tenantId: number
  ): Promise<
    Record<string, { taxRateId: number; credit: number; debit: number }>
  > {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const receivableAccount =
      await accountRepository.findOrCreateAccountReceivable();

    const groupedTaxesById = await AccountTransaction.query()
      .where('account_id', receivableAccount.id)
      .groupBy('tax_rate_id')
      .select(['tax_rate_id'])
      .sum('credit as credit')
      .sum('debit as debit');

    return keyBy(groupedTaxesById, 'taxRateId');
  }

  /**
   * Retrieve taxes sales sum grouped by tax rate id.
   * @param {number} tenantId
   * @returns
   */
  public taxesSalesSumGroupedByRateId = async (tenantId: number) => {
    const { AccountTransaction, Account } = this.tenancy.models(tenantId);

    const incomeAccounts = await Account.query().whereIn('accountType', [
      ACCOUNT_TYPE.INCOME,
      ACCOUNT_TYPE.OTHER_INCOME,
    ]);
    const incomeAccountsIds = incomeAccounts.map((account) => account.id);

    const groupedTaxesById = await AccountTransaction.query()
      .whereIn('account_id', incomeAccountsIds)
      .groupBy('tax_rate_id')
      .select(['tax_rate_id'])
      .sum('credit as credit')
      .sum('debit as debit');

    return keyBy(groupedTaxesById, 'taxRateId');
  };
}
