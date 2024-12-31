import { Knex } from 'knex';
import { Expense } from './models/Expense.model';
import { SystemUser } from '../System/models/SystemUser';
import { IFilterRole } from '../DynamicListing/DynamicFilter/DynamicFilter.types';

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

export interface IExpenseCommonDTO {
  currencyCode: string;
  exchangeRate?: number;
  description?: string;
  paymentAccountId: number;
  peyeeId?: number;
  referenceNo?: string;
  publish: boolean;
  userId: number;
  paymentDate: Date;
  payeeId: number;
  categories: IExpenseCategoryDTO[];

  branchId?: number;
  // attachments?: AttachmentLinkDTO[];
}

export interface IExpenseCreateDTO extends IExpenseCommonDTO {}
export interface IExpenseEditDTO extends IExpenseCommonDTO {}

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
  trx: Knex.Transaction;
  expenseDTO: IExpenseCreateDTO;
}

export interface IExpenseEventEditingPayload {
  oldExpense: Expense;
  expenseDTO: IExpenseEditDTO;
  trx: Knex.Transaction;
}

export interface IExpenseCreatedPayload {
  expenseId: number;
  expense: Expense;
  expenseDTO: IExpenseCreateDTO;
  trx?: Knex.Transaction;
}

export interface IExpenseEventEditPayload {
  expenseId: number;
  expense: Expense;
  expenseDTO: IExpenseEditDTO;
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
