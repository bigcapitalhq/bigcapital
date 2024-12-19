import { IFilterRole } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { Knex } from 'knex';
import { Expense } from '../models/Expense.model';

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
  tenantId: number;
  expenseDTO: IExpenseCreateDTO;
}

export interface IExpenseEventEditingPayload {
  tenantId: number;
  oldExpense: Expense;
  expenseDTO: IExpenseEditDTO;
  trx: Knex.Transaction;
}
export interface IExpenseCreatedPayload {
  tenantId: number;
  expenseId: number;
  // authorizedUser: ISystemUser;
  expense: Expense;
  expenseDTO: IExpenseCreateDTO;
  trx: Knex.Transaction;
}

export interface IExpenseEventEditPayload {
  tenantId: number;
  expenseId: number;
  expense: Expense;
  expenseDTO: IExpenseEditDTO;
  // authorizedUser: ISystemUser;
  oldExpense: Expense;
  trx: Knex.Transaction;
}

export interface IExpenseEventDeletePayload {
  tenantId: number;
  expenseId: number;
  // authorizedUser: ISystemUser;
  oldExpense: Expense;
  trx: Knex.Transaction;
}

export interface IExpenseDeletingPayload {
  trx: Knex.Transaction;
  tenantId: number;
  oldExpense: Expense;
}
export interface IExpenseEventPublishedPayload {
  tenantId: number;
  expenseId: number;
  oldExpense: Expense;
  expense: Expense;
  // authorizedUser: ISystemUser;
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
