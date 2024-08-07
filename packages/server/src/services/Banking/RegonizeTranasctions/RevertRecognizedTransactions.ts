import { Inject, Service } from 'typedi';
import { castArray } from 'lodash';
import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { RevertRecognizedTransactionsCriteria } from './_types';

@Service()
export class RevertRecognizedTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Revert and unlinks the recognized transactions based on the given bank rule
   * and transactions criteria..
   * @param {number} tenantId - Tenant id.
   * @param {number|Array<number>} bankRuleId - Bank rule id.
   * @param {RevertRecognizedTransactionsCriteria} transactionsCriteria -
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async revertRecognizedTransactions(
    tenantId: number,
    ruleId?: number | Array<number>,
    transactionsCriteria?: RevertRecognizedTransactionsCriteria,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { UncategorizedCashflowTransaction, RecognizedBankTransaction } =
      this.tenancy.models(tenantId);

    const rulesIds = castArray(ruleId);

    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Retrieves all the recognized transactions of the banbk rule.
        const uncategorizedTransactions =
          await UncategorizedCashflowTransaction.query(trx).onBuild((q) => {
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
          (r) => r.id
        );
        // Unlink the recongized transactions out of uncategorized transactions.
        await UncategorizedCashflowTransaction.query(trx)
          .whereIn('id', uncategorizedTransactionIds)
          .patch({
            recognizedTransactionId: null,
          });
        // Delete the recognized bank transactions that assocaited to bank rule.
        await RecognizedBankTransaction.query(trx)
          .whereIn('uncategorizedTransactionId', uncategorizedTransactionIds)
          .delete();
      },
      trx
    );
  }
}
