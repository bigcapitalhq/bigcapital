import { Knex } from 'knex';
import { Importable } from '../Import/Importable';
import { ExpensesSampleData } from './constants';
import { Injectable } from '@nestjs/common';
import { CreateExpense } from './commands/CreateExpense.service';
import { CreateExpenseDto } from './dtos/Expense.dto';

@Injectable()
export class ExpensesImportable extends Importable {
  constructor(private readonly createExpenseService: CreateExpense) {
    super();
  }

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    createAccountDTO: CreateExpenseDto,
    trx?: Knex.Transaction,
  ) {
    return this.createExpenseService.newExpense(createAccountDTO, trx);
  }

  /**
   * Concurrrency controlling of the importing process.
   * @returns {number}
   */
  public get concurrency() {
    return 1;
  }

  /**
   * Retrieves the sample data that used to download accounts sample sheet.
   */
  public sampleData(): any[] {
    return ExpensesSampleData;
  }
}
