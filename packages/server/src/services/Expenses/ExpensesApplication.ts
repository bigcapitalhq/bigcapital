import {
  IExpense,
  IExpenseCreateDTO,
  IExpenseEditDTO,
  IExpensesFilter,
  ISystemUser,
} from '@/interfaces';
import { Service, Inject } from 'typedi';
import { CreateExpense } from './CRUD/CreateExpense';
import { DeleteExpense } from './CRUD/DeleteExpense';
import { EditExpense } from './CRUD/EditExpense';
import { GetExpense } from './CRUD/GetExpense';
import { GetExpenses } from './CRUD/GetExpenses';
import { PublishExpense } from './CRUD/PublishExpense';

@Service()
export class ExpensesApplication {
  @Inject()
  private createExpenseService: CreateExpense;

  @Inject()
  private editExpenseService: EditExpense;

  @Inject()
  private deleteExpenseService: DeleteExpense;

  @Inject()
  private publishExpenseService: PublishExpense;

  @Inject()
  private getExpenseService: GetExpense;

  @Inject()
  private getExpensesService: GetExpenses;

  /**
   * Create a new expense transaction.
   * @param   {number} tenantId
   * @param   {IExpenseDTO} expenseDTO
   * @param   {ISystemUser} authorizedUser
   * @returns {Promise<IExpense>}
   */
  public createExpense = (
    tenantId: number,
    expenseDTO: IExpenseCreateDTO,
    authorizedUser: ISystemUser
  ): Promise<IExpense> => {
    return this.createExpenseService.newExpense(
      tenantId,
      expenseDTO,
      authorizedUser
    );
  };

  /**
   * Edits the given expense transaction.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {IExpenseDTO} expenseDTO
   * @param {ISystemUser} authorizedUser
   */
  public editExpense = (
    tenantId: number,
    expenseId: number,
    expenseDTO: IExpenseEditDTO,
    authorizedUser: ISystemUser
  ) => {
    return this.editExpenseService.editExpense(
      tenantId,
      expenseId,
      expenseDTO,
      authorizedUser
    );
  };

  /**
   * Deletes the given expense.
   * @param   {number} tenantId
   * @param   {number} expenseId
   * @param   {ISystemUser} authorizedUser
   * @returns {Promise<void>}
   */
  public deleteExpense = (
    tenantId: number,
    expenseId: number,
    authorizedUser: ISystemUser
  ) => {
    return this.deleteExpenseService.deleteExpense(
      tenantId,
      expenseId,
      authorizedUser
    );
  };

  /**
   * Publishes the given expense.
   * @param  {number} tenantId
   * @param  {number} expenseId
   * @param  {ISystemUser} authorizedUser
   * @return {Promise<void>}
   */
  public publishExpense = (
    tenantId: number,
    expenseId: number,
    authorizedUser: ISystemUser
  ) => {
    return this.publishExpenseService.publishExpense(
      tenantId,
      expenseId,
      authorizedUser
    );
  };

  /**
   * Retrieve the given expense details.
   * @param  {number} tenantId
   * @param  {number} expenseId
   * @return {Promise<IExpense>}
   */
  public getExpense = (tenantId: number, expenseId: number) => {
    return this.getExpenseService.getExpense(tenantId, expenseId);
  };

  /**
   * Retrieve expenses paginated list.
   * @param  {number} tenantId
   * @param  {IExpensesFilter} expensesFilter
   */
  public getExpenses = (tenantId: number, filterDTO: IExpensesFilter) => {
    return this.getExpensesService.getExpensesList(tenantId, filterDTO);
  };
}
