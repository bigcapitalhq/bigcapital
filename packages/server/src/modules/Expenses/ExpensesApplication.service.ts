import { Injectable } from '@nestjs/common';
import { CreateExpense } from './commands/CreateExpense.service';
import { EditExpense } from './commands/EditExpense.service';
import { DeleteExpense } from './commands/DeleteExpense.service';
import { PublishExpense } from './commands/PublishExpense.service';
import { GetExpenseService } from './queries/GetExpense.service';
import { IExpensesFilter } from './interfaces/Expenses.interface';
import { GetExpensesService } from './queries/GetExpenses.service';
import { CreateExpenseDto, EditExpenseDto } from './dtos/Expense.dto';
import { BulkDeleteExpensesService } from './BulkDeleteExpenses.service';
import { ValidateBulkDeleteExpensesService } from './ValidateBulkDeleteExpenses.service';

@Injectable()
export class ExpensesApplication {
  constructor(
    private readonly createExpenseService: CreateExpense,
    private readonly editExpenseService: EditExpense,
    private readonly deleteExpenseService: DeleteExpense,
    private readonly publishExpenseService: PublishExpense,
    private readonly getExpenseService: GetExpenseService,
    private readonly getExpensesService: GetExpensesService,
    private readonly bulkDeleteExpensesService: BulkDeleteExpensesService,
    private readonly validateBulkDeleteExpensesService: ValidateBulkDeleteExpensesService,
  ) { }

  /**
   * Create a new expense transaction.
   * @param {CreateExpenseDto} expenseDTO
   * @returns {Promise<Expense>}
   */
  public createExpense(expenseDTO: CreateExpenseDto) {
    return this.createExpenseService.newExpense(expenseDTO);
  }

  /**
   * Edits the given expense transaction.
   * @param {number} expenseId - Expense id.
   * @param {EditExpenseDto} expenseDTO
   * @returns {Promise<Expense>}
   */
  public editExpense(expenseId: number, expenseDTO: EditExpenseDto) {
    return this.editExpenseService.editExpense(expenseId, expenseDTO);
  }

  /**
   * Deletes the given expense.
   * @param {number} expenseId - Expense id.
   * @returns {Promise<void>}
   */
  public deleteExpense(expenseId: number) {
    return this.deleteExpenseService.deleteExpense(expenseId);
  }

  /**
   * Deletes expenses in bulk.
   * @param {number[]} expenseIds - Expense ids.
   */
  public bulkDeleteExpenses(
    expenseIds: number[],
    options?: { skipUndeletable?: boolean },
  ) {
    return this.bulkDeleteExpensesService.bulkDeleteExpenses(
      expenseIds,
      options,
    );
  }

  /**
   * Validates which expenses can be deleted.
   * @param {number[]} expenseIds - Expense ids.
   */
  public validateBulkDeleteExpenses(expenseIds: number[]) {
    return this.validateBulkDeleteExpensesService.validateBulkDeleteExpenses(
      expenseIds,
    );
  }

  /**
   * Publishes the given expense.
   * @param {number} expenseId - Expense id.
   * @returns {Promise<void>}
   */
  public publishExpense(expenseId: number) {
    return this.publishExpenseService.publishExpense(expenseId);
  }

  /**
   * Retrieve the given expense details.
   * @param {number} expenseId -Expense id.
   * @return {Promise<Expense>}
   */
  public getExpense(expenseId: number) {
    return this.getExpenseService.getExpense(expenseId);
  }

  /**
   * Retrieve expenses paginated list.
   * @param  {IExpensesFilter} expensesFilter
   */
  public getExpenses(filterDTO: Partial<IExpensesFilter>) {
    return this.getExpensesService.getExpensesList(filterDTO);
  }
}
