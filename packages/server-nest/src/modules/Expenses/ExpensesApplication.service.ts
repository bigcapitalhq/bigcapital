import { Injectable } from '@nestjs/common';
import { CreateExpense } from './commands/CreateExpense.service';
import { EditExpense } from './commands/EditExpense.service';
import { DeleteExpense } from './commands/DeleteExpense.service';
import { PublishExpense } from './commands/PublishExpense.service';
import { GetExpenseService } from './queries/GetExpense.service';
import {
  IExpenseCreateDTO,
  IExpenseEditDTO,
} from './interfaces/Expenses.interface';

@Injectable()
export class ExpensesApplication {
  constructor(
    private readonly createExpenseService: CreateExpense,
    private readonly editExpenseService: EditExpense,
    private readonly deleteExpenseService: DeleteExpense,
    private readonly publishExpenseService: PublishExpense,
    private readonly getExpenseService: GetExpenseService,
    // private readonly getExpensesService: GetExpenseService,
  ) {}

  /**
   * Create a new expense transaction.
   * @param {IExpenseDTO} expenseDTO
   * @returns {Promise<Expense>}
   */
  public createExpense = (expenseDTO: IExpenseCreateDTO) => {
    return this.createExpenseService.newExpense(expenseDTO);
  };

  /**
   * Edits the given expense transaction.
   * @param {number} expenseId - Expense id.
   * @param {IExpenseEditDTO} expenseDTO
   * @returns {Promise<Expense>}
   */
  public editExpense = (expenseId: number, expenseDTO: IExpenseEditDTO) => {
    return this.editExpenseService.editExpense(expenseId, expenseDTO);
  };

  /**
   * Deletes the given expense.
   * @param {number} expenseId - Expense id.
   * @returns {Promise<void>}
   */
  public deleteExpense = (expenseId: number) => {
    return this.deleteExpenseService.deleteExpense(expenseId);
  };

  /**
   * Publishes the given expense.
   * @param {number} expenseId - Expense id.
   * @returns {Promise<void>}
   */
  public publishExpense = (expenseId: number) => {
    return this.publishExpenseService.publishExpense(expenseId);
  };

  /**
   * Retrieve the given expense details.
   * @param  {number} expenseId -Expense id.
   * @return {Promise<Expense>}
   */
  public getExpense = (expenseId: number) => {
    return this.getExpenseService.getExpense(expenseId);
  };

  // /**
  //  * Retrieve expenses paginated list.
  //  * @param  {number} tenantId
  //  * @param  {IExpensesFilter} expensesFilter
  //  */
  // public getExpenses = (tenantId: number, filterDTO: IExpensesFilter) => {
  //   return this.getExpensesService.getExpensesList(tenantId, filterDTO);
  // };
}
