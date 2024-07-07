import { Inject, Service } from 'typedi';
import { initialize } from 'objection';
import HasTenancyService from '@/services/Tenancy/TenancyService';

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

    // Retrieves the uncategorized transactions count of the given bank account.
    const uncategorizedTranasctionsCount =
      await UncategorizedCashflowTransaction.query().onBuild((q) => {
        // Include just the given account.
        q.where('accountId', bankAccountId);

        // Only the not excluded.
        q.modify('notExcluded');

        // Only the not categorized.
        q.modify('notCategorized');

        // Only the not matched bank transactions.
        q.withGraphJoined('matchedBankTransactions');
        q.whereNull('matchedBankTransactions.id');

        // Count the results.
        q.count('uncategorized_cashflow_transactions.id as total');
        q.first();
      });

    // Retrieves the recognized transactions count of the given bank account.
    const recognizedTransactionsCount = await RecognizedBankTransaction.query()
      .whereExists(
        UncategorizedCashflowTransaction.query().where(
          'accountId',
          bankAccountId
        )
      )
      .count('id as total')
      .first();

    const totalUncategorizedTransactions =
      uncategorizedTranasctionsCount?.total || 0;
    const totalRecognizedTransactions = recognizedTransactionsCount?.total || 0;

    return {
      name: bankAccount.name,
      totalUncategorizedTransactions,
      totalRecognizedTransactions,
    };
  }
}
