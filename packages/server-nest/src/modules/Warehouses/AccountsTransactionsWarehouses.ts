import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { AccountTransaction } from '../Accounts/models/AccountTransaction.model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class InventoryTransactionsWarehouses {
  constructor(
    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,
  ) {}

  /**
   * Updates all accounts transctions with the priamry branch.
   * @param {number} primaryBranchId - The primary branch id.
   */
  public updateTransactionsWithWarehouse = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.accountTransactionModel().query(trx).update({
      branchId: primaryBranchId,
    });
  };
}
