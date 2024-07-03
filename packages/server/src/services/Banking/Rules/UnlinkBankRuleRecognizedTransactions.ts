import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';

@Service()
export class UnlinkBankRuleRecognizedTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Unlinks the given bank rule out of recognized transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} bankRuleId - Bank rule id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async unlinkBankRuleOutRecognizedTransactions(
    tenantId: number,
    bankRuleId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { UncategorizedCashflowTransaction, RecognizedBankTransaction } =
      this.tenancy.models(tenantId);

    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Retrieves all the recognized transactions of the banbk rule.
        const recognizedTransactions = await RecognizedBankTransaction.query(
          trx
        ).where('bankRuleId', bankRuleId);

        const uncategorizedTransactionIds = recognizedTransactions.map(
          (r) => r.uncategorizedTransactionId
        );
        // Unlink the recongized transactions out of uncategorized transactions.
        await UncategorizedCashflowTransaction.query(trx)
          .whereIn('id', uncategorizedTransactionIds)
          .patch({
            recognizedTransactionId: null,
          });
        // Delete the recognized bank transactions that assocaited to bank rule.
        await RecognizedBankTransaction.query(trx)
          .where({ bankRuleId })
          .delete();
      },
      trx
    );
  }
}
