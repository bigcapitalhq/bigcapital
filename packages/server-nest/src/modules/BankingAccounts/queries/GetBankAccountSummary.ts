import { Inject, Injectable } from '@nestjs/common';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { BaseModel } from '@/models/Model';

@Injectable()
export class GetBankAccountSummary {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: typeof Account,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Retrieves the bank account meta summary
   * @param {number} bankAccountId - The bank account id.
   * @returns {Promise<IBankAccountSummary>}
   */
  public async getBankAccountSummary(bankAccountId: number) {
    const bankAccount = await this.accountModel
      .query()
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

    interface UncategorizedTransactionsCount {
      total: number;
    }

    // Retrieves the uncategorized transactions count of the given bank account.
    const uncategorizedTranasctionsCount =
      await this.uncategorizedBankTransactionModel.query().onBuild((q) => {
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
      await this.uncategorizedBankTransactionModel.query().onBuild((q) => {
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
      await this.uncategorizedBankTransactionModel.query().onBuild((q) => {
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
      await this.uncategorizedBankTransactionModel.query().onBuild((q) => {
        q.where('accountId', bankAccountId);
        q.modify('pending');

        // Count the results.
        q.count('uncategorized_cashflow_transactions.id as total');
        q.first();
      });

    const totalUncategorizedTransactions =
      // @ts-ignore
      uncategorizedTranasctionsCount?.total || 0;
    // @ts-ignore
    const totalRecognizedTransactions = recognizedTransactionsCount?.total || 0;
    // @ts-ignore
    const totalExcludedTransactions = excludedTransactionsCount?.total || 0;
    // @ts-ignore
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
