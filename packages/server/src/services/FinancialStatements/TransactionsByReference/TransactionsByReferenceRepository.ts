import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';
import { IAccount, IAccountTransaction, ITransactionsByReferenceQuery } from '@/interfaces';

@Service()
export default class TransactionsByReferenceRepository {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the accounts transactions of the given reference id and type.
   * @param {number} tenantId - 
   * @param {number} referenceId - Reference id.
   * @param {string} referenceType - Reference type.
   * @return {Promise<IAccountTransaction[]>}
   */
  public getTransactions(
    tenantId: number,
    referenceId: number,
    referenceType: string,
  ): Promise<(IAccountTransaction & { account: IAccount }) []> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    return AccountTransaction.query()
      .where('reference_id', referenceId)
      .where('reference_type', referenceType)
      .withGraphFetched('account');
  }
}
