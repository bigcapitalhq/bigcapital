import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export class MutateBaseCurrencyAccounts {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Mutates the all accounts or the organziation.
   * @param {number} tenantId
   * @param {string} currencyCode
   */
  public mutateAllAccountsCurrency = async (tenantId: number, currencyCode: string) => {
    const { Account } = this.tenancy.models(tenantId);

    await Account.query().update({ currencyCode });
  };
}
