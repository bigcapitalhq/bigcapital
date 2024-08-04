import { Inject, Service } from 'typedi';
import { DisconnectBankAccount } from './DisconnectBankAccount';
import { RefreshBankAccountService } from './RefreshBankAccount';
import { PauseBankAccountFeeds } from './PauseBankAccountFeeds';
import { ResumeBankAccountFeeds } from './ResumeBankAccountFeeds';

@Service()
export class BankAccountsApplication {
  @Inject()
  private disconnectBankAccountService: DisconnectBankAccount;

  @Inject()
  private refreshBankAccountService: RefreshBankAccountService;

  @Inject()
  private resumeBankAccountFeedsService: ResumeBankAccountFeeds;

  @Inject()
  private pauseBankAccountFeedsService: PauseBankAccountFeeds;

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

  /**
   * Pauses the feeds sync of the given bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  async pauseBankAccount(tenantId: number, bankAccountId: number) {
    return this.pauseBankAccountFeedsService.pauseBankAccountFeeds(
      tenantId,
      bankAccountId
    );
  }

  /**
   * Resumes the feeds sync of the given bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  async resumeBankAccount(tenantId: number, bankAccountId: number) {
    return this.resumeBankAccountFeedsService.resumeBankAccountFeeds(
      tenantId,
      bankAccountId
    );
  }
}
