import { Injectable } from '@nestjs/common';
import { DeleteCashflowTransaction } from './commands/DeleteCashflowTransaction.service';
import { CreateBankTransactionService } from './commands/CreateBankTransaction.service';
import { GetBankTransactionService } from './queries/GetBankTransaction.service';
import {
  IBankAccountsFilter,
  ICashflowAccountTransactionsQuery,
} from './types/BankingTransactions.types';
import { GetBankAccountsService } from './queries/GetBankAccounts.service';
import { CreateBankTransactionDto } from './dtos/CreateBankTransaction.dto';
import { GetBankAccountTransactionsService } from './queries/GetBankAccountTransactions/GetBankAccountTransactions.service';

@Injectable()
export class BankingTransactionsApplication {
  constructor(
    private readonly createTransactionService: CreateBankTransactionService,
    private readonly deleteTransactionService: DeleteCashflowTransaction,
    private readonly getCashflowTransactionService: GetBankTransactionService,
    private readonly getBankAccountsService: GetBankAccountsService,
    private readonly getBankAccountTransactionsService: GetBankAccountTransactionsService,
  ) {}

  /**
   * Creates a new cashflow transaction.
   * @param {ICashflowNewCommandDTO} transactionDTO
   * @returns
   */
  public createTransaction(transactionDTO: CreateBankTransactionDto) {
    return this.createTransactionService.newCashflowTransaction(transactionDTO);
  }

  /**
   * Deletes the given cashflow transaction.
   * @param {number} cashflowTransactionId - Cashflow transaction id.
   * @returns {Promise<{ oldCashflowTransaction: ICashflowTransaction }>}
   */
  public deleteTransaction(cashflowTransactionId: number) {
    return this.deleteTransactionService.deleteCashflowTransaction(
      cashflowTransactionId,
    );
  }

  /**
   * Retrieves the bank transactions of the given bank id.
   * @param {ICashflowAccountTransactionsQuery} query
   */
  public getBankAccountTransactions(query: ICashflowAccountTransactionsQuery) {
    return this.getBankAccountTransactionsService.bankAccountTransactions(
      query,
    );
  }

  /**
   * Retrieves specific cashflow transaction.
   * @param {number} cashflowTransactionId
   * @returns
   */
  public getTransaction(cashflowTransactionId: number) {
    return this.getCashflowTransactionService.getBankTransaction(
      cashflowTransactionId,
    );
  }

  /**
   * Retrieves the cashflow accounts.
   * @param {IBankAccountsFilter} filterDTO
   */
  public getBankAccounts(filterDTO: IBankAccountsFilter) {
    return this.getBankAccountsService.getBankAccounts(filterDTO);
  }
}
