import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { Importable } from '../Import/Importable';
import { ExpensesSampleData } from './constants';
import { CreateExpense } from './commands/CreateExpense.service';
import { CreateExpenseDto } from './dtos/Expense.dto';
import { ImportableService } from '../Import/decorators/Import.decorator';
import { Expense } from './models/Expense.model';

@Injectable()
@ImportableService({ name: Expense.name })
export class ExpensesImportable extends Importable {
  constructor(private readonly createExpenseService: CreateExpense) {
    super();
  }

  /**
   * Importing to expense service.
   * @param {CreateExpenseDto} createAccountDTO
   */
  public importable(
    createExpenseDto: CreateExpenseDto,
    trx?: Knex.Transaction,
  ) {
    return this.createExpenseService.newExpense(createExpenseDto, trx);
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
