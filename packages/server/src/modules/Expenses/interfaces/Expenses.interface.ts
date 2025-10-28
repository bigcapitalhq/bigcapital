import { IFilterRole } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { Knex } from 'knex';
import { Expense } from '../models/Expense.model';
import { CreateExpenseDto, EditExpenseDto } from '../dtos/Expense.dto';

// import { AttachmentLinkDTO } from '../Attachments/Attachments';

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

export interface IExpenseCategoryDTO {
  id?: number;
  expenseAccountId: number;
  index: number;
  amount: number;
  description?: string;
  expenseId: number;
  landedCost?: boolean;
  projectId?: number;
}

export interface IExpenseCreatingPayload {
  expenseDTO: CreateExpenseDto;
  trx: Knex.Transaction;
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
  trx: Knex.Transaction;
}

export interface IExpenseEventEditPayload {
  expenseId: number;
  expense: Expense;
  expenseDTO: EditExpenseDto;
  oldExpense: Expense;
  trx: Knex.Transaction;
}

export interface IExpenseEventDeletePayload {
  expenseId: number;
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
  trx: Knex.Transaction;
}

export interface IExpensePublishingPayload {
  trx: Knex.Transaction;
  oldExpense: Expense;
  tenantId: number;
}
export enum ExpenseAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
}
