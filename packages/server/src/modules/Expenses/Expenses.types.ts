import { Knex } from 'knex';
import { Expense } from './models/Expense.model';
import { SystemUser } from '../System/models/SystemUser';
import { IFilterRole } from '../DynamicListing/DynamicFilter/DynamicFilter.types';
import { CreateExpenseDto, EditExpenseDto } from './dtos/Expense.dto';
import { CreateExpense } from './commands/CreateExpense.service';

export interface IPaginationMeta {
  total: number;
  page: number;
  pageSize: number;
}

export interface IExpensesFilter {
  page: number;
  pageSize: number;
  filterRoles?: IFilterRole[];
  columnSortBy: string;
  sortOrder: string;
  viewSlug?: string;
  filterQuery?: (query: any) => void;
}

export interface IExpenseCreatingPayload {
  trx: Knex.Transaction;
  expenseDTO: CreateExpenseDto;
}

export interface IExpenseEventEditingPayload {
  oldExpense: Expense;
  expenseDTO: EditExpenseDto;
  trx: Knex.Transaction;
}

export interface IExpenseCreatedPayload {
  expenseId: number;
  expense: Expense;
  expenseDTO: CreateExpenseDto;
  trx?: Knex.Transaction;
}

export interface IExpenseEventEditPayload {
  expenseId: number;
  expense: Expense;
  expenseDTO: EditExpenseDto;
  authorizedUser: SystemUser;
  oldExpense: Expense;
  trx: Knex.Transaction;
}

export interface IExpenseEventDeletePayload {
  expenseId: number;
  authorizedUser: SystemUser;
  oldExpense: Expense;
  trx: Knex.Transaction;
}

export interface IExpenseDeletingPayload {
  trx: Knex.Transaction;
  oldExpense: Expense;
}
export interface IExpenseEventPublishedPayload {
  expenseId: number;
  oldExpense: Expense;
  expense: Expense;
  authorizedUser: SystemUser;
  trx: Knex.Transaction;
}

export interface IExpensePublishingPayload {
  trx: Knex.Transaction;
  oldExpense: Expense;
}
export enum ExpenseAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
}
