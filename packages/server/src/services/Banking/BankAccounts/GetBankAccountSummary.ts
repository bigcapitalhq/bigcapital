import { Inject, Service } from 'typedi';
import { initialize } from 'objection';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { UncategorizedTransactionTransformer } from '@/services/Cashflow/UncategorizedTransactionTransformer';

@Service()
export class GetBankAccountSummary {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the bank account meta summary
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns
   */
  public async getBankAccountSummary(tenantId: number, bankAccountId: number) {
    const knex = this.tenancy.knex(tenantId);
    const {
      Account,
      UncategorizedCashflowTransaction,
      RecognizedBankTransaction,
      MatchedBankTransaction,
    } = this.tenancy.models(tenantId);

    await initialize(knex, [
      UncategorizedCashflowTransaction,
      RecognizedBankTransaction,
      MatchedBankTransaction,
    ]);
    const bankAccount = await Account.query()
      .findById(bankAccountId)
      .throwIfNotFound();

    const commonQuery = (q) => {
      // Include just the given account.
      q.where('accountId', bankAccountId);

      // Only the not excluded.
      q.modify('notExcluded');

      // Only the not categorized.
      q.modify('notCategorized');
    };

    // Retrieves the uncategorized transactions count of the given bank account.
    const uncategorizedTranasctionsCount =
      await UncategorizedCashflowTransaction.query().onBuild((q) => {
        commonQuery(q);

        // Only the not matched bank transactions.
        q.withGraphJoined('matchedBankTransactions');
        q.whereNull('matchedBankTransactions.id');

        // Exclude the pending transactions.
        q.modify('notPending');

        // Count the results.
        q.count('uncategorized_cashflow_transactions.id as total');
        q.first();
      });

    // Retrives the recognized transactions count.
    const recognizedTransactionsCount =
      await UncategorizedCashflowTransaction.query().onBuild((q) => {
        commonQuery(q);

        q.withGraphJoined('recognizedTransaction');
        q.whereNotNull('recognizedTransaction.id');

        // Exclude the pending transactions.
        q.modify('notPending');

        // Count the results.
        q.count('uncategorized_cashflow_transactions.id as total');
        q.first();
      });
    // Retrieves excluded transactions count.
    const excludedTransactionsCount =
      await UncategorizedCashflowTransaction.query().onBuild((q) => {
        q.where('accountId', bankAccountId);
        q.modify('excluded');

        // Exclude the pending transactions.
        q.modify('notPending');

        // Count the results.
        q.count('uncategorized_cashflow_transactions.id as total');
        q.first();
      });
    // Retrieves the pending transactions count.
    const pendingTransactionsCount =
      await UncategorizedCashflowTransaction.query().onBuild((q) => {
        q.where('accountId', bankAccountId);
        q.modify('pending');

        // Count the results.
        q.count('uncategorized_cashflow_transactions.id as total');
        q.first();
      });

    const totalUncategorizedTransactions =
      uncategorizedTranasctionsCount?.total || 0;
    const totalRecognizedTransactions = recognizedTransactionsCount?.total || 0;
    const totalExcludedTransactions = excludedTransactionsCount?.total || 0;
    const totalPendingTransactions = pendingTransactionsCount?.total || 0;

    return {
      name: bankAccount.name,
      totalUncategorizedTransactions,
      totalRecognizedTransactions,
      totalExcludedTransactions,
      totalPendingTransactions,
    };
  }
}
