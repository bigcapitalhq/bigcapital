import { Inject, Service } from 'typedi';
import { DisconnectBankAccount } from './DisconnectBankAccount';
import { RefreshBankAccountService } from './RefreshBankAccount';

@Service()
export class BankAccountsApplication {
  @Inject()
  private disconnectBankAccountService: DisconnectBankAccount;

  @Inject()
  private refreshBankAccountService: RefreshBankAccountService;

  /**
   * Disconnects the given bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  async disconnectBankAccount(tenantId: number, bankAccountId: number) {
    return this.disconnectBankAccountService.disconnectBankAccount(
      tenantId,
      bankAccountId
    );
  }

  /**
   * Refresh the bank transactions of the given bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>} 
   */
  async refreshBankAccount(tenantId: number, bankAccountId: number) {
    return this.refreshBankAccountService.refreshBankAccount(
      tenantId,
      bankAccountId
    );
  }
}
