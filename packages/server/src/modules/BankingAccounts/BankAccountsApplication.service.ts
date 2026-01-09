import { Injectable } from '@nestjs/common';
import { DisconnectBankAccountService } from './commands/DisconnectBankAccount.service';
import { RefreshBankAccountService } from './commands/RefreshBankAccount.service';
import { ResumeBankAccountFeedsService } from './commands/ResumeBankAccountFeeds.service';
import { PauseBankAccountFeeds } from './commands/PauseBankAccountFeeds.service';
import { GetBankAccountsService } from './queries/GetBankAccounts';
import { ICashflowAccountsFilter } from './types/BankAccounts.types';
import { GetBankAccountSummary } from './queries/GetBankAccountSummary';
import { BankAccountsQueryDto } from './dtos/BankAccountsQuery.dto';

@Injectable()
export class BankAccountsApplication {
  constructor(
    private readonly getBankAccountsService: GetBankAccountsService,
    private readonly getBankAccountSummaryService: GetBankAccountSummary,
    private readonly disconnectBankAccountService: DisconnectBankAccountService,
    private readonly refreshBankAccountService: RefreshBankAccountService,
    private readonly resumeBankAccountFeedsService: ResumeBankAccountFeedsService,
    private readonly pauseBankAccountFeedsService: PauseBankAccountFeeds,
  ) { }

  /**
   * Retrieves the bank accounts.
   * @param {ICashflowAccountsFilter} filterDto -
   */
  getBankAccounts(filterDto: BankAccountsQueryDto) {
    return this.getBankAccountsService.getCashflowAccounts(filterDto);
  }

  /**
   * Retrieves the given bank account summary.
   * @param {number} bankAccountId
   */
  getBankAccountSumnmary(bankAccountId: number) {
    return this.getBankAccountSummaryService.getBankAccountSummary(
      bankAccountId,
    );
  }

  /**
   * Disconnects the given bank account.
   * @param {number} bankAccountId - Bank account identifier.
   * @returns {Promise<void>}
   */
  async disconnectBankAccount(bankAccountId: number) {
    return this.disconnectBankAccountService.disconnectBankAccount(
      bankAccountId,
    );
  }

  /**
   * Refresh the bank transactions of the given bank account.
   * @param {number} bankAccountId - Bank account identifier.
   * @returns {Promise<void>}
   */
  async refreshBankAccount(bankAccountId: number) {
    return this.refreshBankAccountService.refreshBankAccount(bankAccountId);
  }

  /**
   * Pauses the feeds sync of the given bank account.
   * @param {number} bankAccountId - Bank account identifier.
   * @returns {Promise<void>}
   */
  async pauseBankAccount(bankAccountId: number) {
    return this.pauseBankAccountFeedsService.pauseBankAccountFeeds(
      bankAccountId,
    );
  }

  /**
   * Resumes the feeds sync of the given bank account.
   * @param {number} bankAccountId - Bank account identifier.
   * @returns {Promise<void>}
   */
  async resumeBankAccount(bankAccountId: number) {
    return this.resumeBankAccountFeedsService.resumeBankAccountFeeds(
      bankAccountId,
    );
  }
}
