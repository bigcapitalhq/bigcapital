import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class MutateBaseCurrencyAccounts {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Mutates the all accounts or the organization.
   * @param {number} tenantId
   * @param {string} currencyCode
   */
  public mutateAllAccountsCurrency = async (
    tenantId: number,
    currencyCode: string
  ) => {
    const { Account } = this.tenancy.models(tenantId);

    await Account.query().update({ currencyCode });
  };
}
