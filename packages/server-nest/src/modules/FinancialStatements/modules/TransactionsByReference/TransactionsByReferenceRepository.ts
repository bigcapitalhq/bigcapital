import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Inject, Injectable } from '@nestjs/common';
import { ModelObject } from 'objection';

@Injectable()
export class TransactionsByReferenceRepository {
  constructor(
    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: typeof AccountTransaction,
  ) {}

  /**
   * Retrieve the accounts transactions of the givne reference id and type.
   * @param {number} tenantId - 
   * @param {number} referenceId - Reference id.
   * @param {string} referenceType - Reference type.
   * @return {Promise<IAccountTransaction[]>}
   */
  public async getTransactions(
    referenceId: number,
    referenceType: string,
  ): Promise<Array<ModelObject<AccountTransaction>>> {
    return this.accountTransactionModel.query()
      .where('reference_id', referenceId)
      .where('reference_type', referenceType)
      .withGraphFetched('account');
  }
}
