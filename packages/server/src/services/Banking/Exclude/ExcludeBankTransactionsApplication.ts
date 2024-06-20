import { Inject, Service } from 'typedi';
import { ExcludeBankTransaction } from './ExcludeBankTransaction';
import { UnexcludeBankTransaction } from './UnexcludeBankTransaction';

@Service()
export class ExcludeBankTransactionsApplication {
  @Inject()
  private excludeBankTransactionService: ExcludeBankTransaction;

  @Inject()
  private unexcludeBankTransactionService: UnexcludeBankTransaction;

  /**
   * Marks a bank transaction as excluded.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} bankTransactionId - The ID of the bank transaction to exclude.
   * @returns {Promise<void>}
   */
  public excludeBankTransaction(tenantId: number, bankTransactionId: number) {
    return this.excludeBankTransactionService.excludeBankTransaction(
      tenantId,
      bankTransactionId
    );
  }

  /**
   * Marks a bank transaction as not excluded.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} bankTransactionId - The ID of the bank transaction to exclude.
   * @returns {Promise<void>}
   */
  public unexcludeBankTransaction(tenantId: number, bankTransactionId: number) {
    return this.unexcludeBankTransactionService.unexcludeBankTransaction(
      tenantId,
      bankTransactionId
    );
  }
}
