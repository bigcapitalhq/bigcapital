import { Service, Inject } from 'typedi';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './constants';

@Service()
export default class CashflowDeleteAccount {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validate the account has no associated cashflow transactions.
   * @param {number} tenantId 
   * @param {number} accountId 
   */
  public validateAccountHasNoCashflowEntries = async (
    tenantId: number,
    accountId: number
  ) => {
    const { CashflowTransactionLine } = this.tenancy.models(tenantId);

    const associatedLines = await CashflowTransactionLine.query()
      .where('creditAccountId', accountId)
      .orWhere('cashflowAccountId', accountId);

    if (associatedLines.length > 0) {
      throw new ServiceError(ERRORS.ACCOUNT_HAS_ASSOCIATED_TRANSACTIONS)
    }
  };
}
