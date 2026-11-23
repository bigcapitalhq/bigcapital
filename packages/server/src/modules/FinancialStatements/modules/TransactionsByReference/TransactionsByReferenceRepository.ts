import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Inject, Injectable } from '@nestjs/common';
import { AccountingBasis } from '@/common/types/AccountingBasis';

@Injectable()
export class TransactionsByReferenceRepository {
  constructor(
    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,
  ) {}

  /**
   * Retrieve the accounts transactions of the givne reference id and type.
   * @param {number} referenceId - Reference id.
   * @param {string} referenceType - Reference type.
   * @param {AccountingBasis} basis - Accounting basis.
   * @return {Promise<IAccountTransaction[]>}
   */
  public async getTransactions(
    referenceId: number,
    referenceType: string,
    basis?: AccountingBasis,
  ): Promise<Array<AccountTransaction>> {
    return this.accountTransactionModel()
      .query()
      .skipUndefined()
      .where('reference_id', referenceId)
      .where('reference_type', referenceType)
      .modify('filterByBasis', basis)
      .withGraphFetched('account');
  }
}
