import {
  CategorizeTransactionAsExpenseDTO,
  ICashflowTransactionCategorizedPayload,
} from '@/interfaces';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { Expense } from '@/modules/Expenses/models/Expense.model';
import { BankTransaction } from '@/modules/BankingTransactions/models/BankTransaction';
import { CreateExpense } from '@/modules/Expenses/commands/CreateExpense.service';
import { Inject } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { ICashflowTransactionUncategorizedPayload } from '../types/BankingCategorize.types';

@Injectable()
export class CategorizeTransactionAsExpense {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly createExpenseService: CreateExpense,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,

    @Inject(Expense.name)
    private readonly expenseModel: typeof Expense,

    @Inject(BankTransaction.name)
    private readonly bankTransactionModel: typeof BankTransaction,
  ) {}

  /**
   * Categorize the transaction as expense transaction.
   * @param {number} cashflowTransactionId
   * @param {CategorizeTransactionAsExpenseDTO} transactionDTO
   */
  public async categorize(
    cashflowTransactionId: number,
    transactionDTO: CategorizeTransactionAsExpenseDTO,
  ) {
    const transaction = await this.bankTransactionModel
      .query()
      .findById(cashflowTransactionId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onTransactionUncategorizing` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorizingAsExpense,
        {
          trx,
        } as ICashflowTransactionCategorizedPayload,
      );
      // Creates a new expense transaction.
      const expenseTransaction = await this.createExpenseService.newExpense({});

      // Updates the item on the storage and fetches the updated once.
      const cashflowTransaction = await this.bankTransactionModel
        .query(trx)
        .patchAndFetchById(cashflowTransactionId, {
          categorizeRefType: 'Expense',
          categorizeRefId: expenseTransaction.id,
          uncategorized: true,
        });
      // Triggers `onTransactionUncategorized` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorizedAsExpense,
        {
          cashflowTransaction,
          trx,
        } as ICashflowTransactionUncategorizedPayload,
      );
    });
  }
}
