import { Knex } from 'knex';
import { DeleteCashflowTransaction } from './commands/DeleteCashflowTransaction.service';
import { CreateBankTransactionService } from './commands/CreateBankTransaction.service';
import { GetBankTransactionService } from './queries/GetBankTransaction.service';
import { ICashflowNewCommandDTO } from './types/BankingTransactions.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BankingTransactionsApplication {
  constructor(
    private readonly createTransactionService: CreateBankTransactionService,
    private readonly deleteTransactionService: DeleteCashflowTransaction,
    private readonly getCashflowTransactionService: GetBankTransactionService,
    // private readonly getCashflowAccountsService: GetBankingAccountsServic,
  ) {}

  /**
   * Creates a new cashflow transaction.
   * @param {ICashflowNewCommandDTO} transactionDTO
   * @returns
   */
  public createTransaction(transactionDTO: ICashflowNewCommandDTO) {
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
   * @param {ICashflowAccountsFilter} filterDTO
   * @returns
   */
  public getCashflowAccounts(
    // filterDTO: ICashflowAccountsFilter,
  ) {
    // return this.getCashflowAccountsService.getCashflowAccounts(filterDTO);
  }
}
