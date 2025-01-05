import { castArray } from 'lodash';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { RevertRecognizedTransactionsCriteria } from '../_types';
import { RecognizedBankTransaction } from '../models/RecognizedBankTransaction';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';

@Injectable()
export class RevertRecognizedTransactionsService {
  constructor(
    private readonly uow: UnitOfWork,

    @Inject(RecognizedBankTransaction.name)
    private readonly recognizedBankTransactionModel: typeof RecognizedBankTransaction,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Revert and unlinks the recognized transactions based on the given bank rule
   * and transactions criteria..
   * @param {number|Array<number>} bankRuleId - Bank rule id.
   * @param {RevertRecognizedTransactionsCriteria} transactionsCriteria -
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async revertRecognizedTransactions(
    ruleId?: number | Array<number>,
    transactionsCriteria?: RevertRecognizedTransactionsCriteria,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const rulesIds = castArray(ruleId);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Retrieves all the recognized transactions of the banbk rule.
      const uncategorizedTransactions =
        await this.uncategorizedBankTransactionModel.query(trx).onBuild((q) => {
          q.withGraphJoined('recognizedTransaction');
          q.whereNotNull('recognizedTransaction.id');

          if (rulesIds.length > 0) {
            q.whereIn('recognizedTransaction.bankRuleId', rulesIds);
          }
          if (transactionsCriteria?.accountId) {
            q.where('accountId', transactionsCriteria.accountId);
          }
          if (transactionsCriteria?.batch) {
            q.where('batch', transactionsCriteria.batch);
          }
        });
      const uncategorizedTransactionIds = uncategorizedTransactions.map(
        (r) => r.id,
      );
      // Unlink the recongized transactions out of uncategorized transactions.
      await this.uncategorizedBankTransactionModel
        .query(trx)
        .whereIn('id', uncategorizedTransactionIds)
        .patch({
          recognizedTransactionId: null,
        });
      // Delete the recognized bank transactions that assocaited to bank rule.
      await this.recognizedBankTransactionModel
        .query(trx)
        .whereIn('uncategorizedTransactionId', uncategorizedTransactionIds)
        .delete();
    }, trx);
  }
}
