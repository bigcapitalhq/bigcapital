import { Inject, Service } from 'typedi';
import { DisconnectBankAccount } from './DisconnectBankAccount';

@Service()
export class BankAccountsApplication {
  @Inject()
  private disconnectBankAccountService: DisconnectBankAccount;

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
}
