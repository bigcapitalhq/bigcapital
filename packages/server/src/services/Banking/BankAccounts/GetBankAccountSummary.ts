import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Server } from 'socket.io';
import { Inject, Service } from 'typedi';

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
    const {
      Account,
      UncategorizedCashflowTransaction,
      RecognizedBankTransaction,
    } = this.tenancy.models(tenantId);

    const bankAccount = await Account.query()
      .findById(bankAccountId)
      .throwIfNotFound();

    const uncategorizedTranasctionsCount =
      await UncategorizedCashflowTransaction.query()
        .where('accountId', bankAccountId)
        .count('id as total')
        .first();

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
      uncategorizedTranasctionsCount?.total;
    const totalRecognizedTransactions = recognizedTransactionsCount?.total;

    return {
      name: bankAccount.name,
      totalUncategorizedTransactions,
      totalRecognizedTransactions,
    };
  }
}
