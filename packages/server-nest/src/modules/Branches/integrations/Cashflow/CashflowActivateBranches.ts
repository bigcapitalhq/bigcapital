import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { BankTransaction } from '@/modules/BankingTransactions/models/BankTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CashflowTransactionsActivateBranches {
  constructor(
    private readonly bankTransaction: TenantModelProxy<typeof BankTransaction>,
  ) {}

  /**
   * Updates all cashflow transactions with the primary branch.
   * @param {number} primaryBranchId - The primary branch id.
   * @param {Knex.Transaction} trx - The database transaction.
   * @returns {Promise<void>}
   */
  public updateCashflowTransactionsWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the cashflow transactions with primary branch.
    await this.bankTransaction()
      .query(trx)
      .update({ branchId: primaryBranchId });
  };
}
