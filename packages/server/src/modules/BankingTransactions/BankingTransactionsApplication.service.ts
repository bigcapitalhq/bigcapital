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
import { GetUncategorizedTransactions } from './queries/GetUncategorizedTransactions';
import { GetUncategorizedBankTransactionService } from './queries/GetUncategorizedBankTransaction.service';
import { GetUncategorizedTransactionsQueryDto } from './dtos/GetUncategorizedTransactionsQuery.dto';
import { GetPendingBankAccountTransactions } from './queries/GetPendingBankAccountTransaction.service';
import { GetPendingTransactionsQueryDto } from './dtos/GetPendingTransactionsQuery.dto';
import { GetAutofillCategorizeTransactionService } from './queries/GetAutofillCategorizeTransaction/GetAutofillCategorizeTransaction.service';
import { GetBankTransactionsQueryDto } from './dtos/GetBankTranasctionsQuery.dto';

@Injectable()
export class BankingTransactionsApplication {
  constructor(
    private readonly createTransactionService: CreateBankTransactionService,
    private readonly deleteTransactionService: DeleteCashflowTransaction,
    private readonly getCashflowTransactionService: GetBankTransactionService,
    private readonly getBankAccountsService: GetBankAccountsService,
    private readonly getBankAccountTransactionsService: GetBankAccountTransactionsService,
    private readonly getBankAccountUncategorizedTransitionsService: GetUncategorizedTransactions,
    private readonly getBankAccountUncategorizedTransactionService: GetUncategorizedBankTransactionService,
    private readonly getPendingBankAccountTransactionsService: GetPendingBankAccountTransactions,
    private readonly getAutofillCategorizeTransactionService: GetAutofillCategorizeTransactionService,
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
  public getBankAccountTransactions(query: GetBankTransactionsQueryDto) {
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

  /**
   * Retrieves the uncategorized cashflow transactions.
   * @param {number} accountId - Account id.
   * @param {IGetUncategorizedTransactionsQuery} query - Query.
   */
  public getBankAccountUncategorizedTransactions(
    accountId: number,
    query: GetUncategorizedTransactionsQueryDto,
  ) {
    return this.getBankAccountUncategorizedTransitionsService.getTransactions(
      accountId,
      query,
    );
  }

  /**
   * Retrieves specific uncategorized cashflow transaction.
   * @param {number} uncategorizedTransactionId - Uncategorized transaction id.
   */
  public getUncategorizedTransaction(uncategorizedTransactionId: number) {
    return this.getBankAccountUncategorizedTransactionService.getTransaction(
      uncategorizedTransactionId,
    );
  }

  /**
   * Retrieves the pending bank account transactions.
   * @param {GetPendingTransactionsQueryDto} filter - Pending transactions query.
   */
  public getPendingBankAccountTransactions(
    filter?: GetPendingTransactionsQueryDto,
  ) {
    return this.getPendingBankAccountTransactionsService.getPendingTransactions(
      filter,
    );
  }

  /**
   * Retrieves the autofill values of categorize transactions form.
   * @param {Array<number> | number} uncategorizeTransactionsId - Uncategorized transactions ids.
   */
  public getAutofillCategorizeTransaction(
    uncategorizeTransactionsId: Array<number> | number,
  ) {
    return this.getAutofillCategorizeTransactionService.getAutofillCategorizeTransaction(
      uncategorizeTransactionsId,
    );
  }
}
