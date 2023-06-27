import { Knex } from 'knex';
import { ISystemUser } from './User';
import { IFilterRole } from './DynamicFilter';
import { IAccount } from './Account';

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
}

export interface IExpense {
  id: number;
  totalAmount: number;
  localAmount?: number;
  currencyCode: string;
  exchangeRate: number;
  description?: string;
  paymentAccountId: number;
  payeeId?: number;
  referenceNo?: string;
  publishedAt: Date | null;
  userId: number;
  paymentDate: Date;
  payeeId: number;
  landedCostAmount: number;
  allocatedCostAmount: number;
  unallocatedCostAmount: number;
  categories?: IExpenseCategory[];
  isPublished: boolean;

  localLandedCostAmount?: number;
  localAllocatedCostAmount?: number;
  localUnallocatedCostAmount?: number;
  
  billableAmount: number;
  invoicedAmount: number;

  branchId?: number;

  createdAt?: Date;
}

export interface IExpenseCategory {
  id?: number;
  expenseAccountId: number;
  index: number;
  description: string;
  expenseId: number;
  amount: number;

  projectId?: number;

  allocatedCostAmount: number;
  unallocatedCostAmount: number;
  landedCost: boolean;

  expenseAccount?: IAccount;
}

export interface IExpenseCommonDTO {
  currencyCode: string;
  exchangeRate?: number;
  description?: string;
  paymentAccountId: number;
  payeeId?: number;
  referenceNo?: string;
  publish: boolean;
  userId: number;
  paymentDate: Date;
  payeeId: number;
  categories: IExpenseCategoryDTO[];

  branchId?: number;
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

export interface IExpensesService {
  newExpense(
    tenantid: number,
    expenseDTO: IExpenseDTO,
    authorizedUser: ISystemUser
  ): Promise<IExpense>;

  editExpense(
    tenantid: number,
    expenseId: number,
    expenseDTO: IExpenseDTO,
    authorizedUser: ISystemUser
  ): void;

  publishExpense(
    tenantId: number,
    expenseId: number,
    authorizedUser: ISystemUser
  ): Promise<void>;

  deleteExpense(
    tenantId: number,
    expenseId: number,
    authorizedUser: ISystemUser
  ): Promise<void>;

  getExpensesList(
    tenantId: number,
    expensesFilter: IExpensesFilter
  ): Promise<{
    expenses: IExpense[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }>;

  getExpense(tenantId: number, expenseId: number): Promise<IExpense>;
}

export interface IExpenseCreatingPayload {
  trx: Knex.Transaction;
  tenantId: number;
  expenseDTO: IExpenseCreateDTO;
}

export interface IExpenseEventEditingPayload {
  tenantId: number;
  oldExpense: IExpense;
  expenseDTO: IExpenseEditDTO;
  trx: Knex.Transaction;
}
export interface IExpenseCreatedPayload {
  tenantId: number;
  expenseId: number;
  authorizedUser: ISystemUser;
  expense: IExpense;
  trx: Knex.Transaction;
}

export interface IExpenseEventEditPayload {
  tenantId: number;
  expenseId: number;
  expense: IExpense;
  expenseDTO: IExpenseEditDTO;
  authorizedUser: ISystemUser;
  oldExpense: IExpense;
  trx: Knex.Transaction;
}

export interface IExpenseEventDeletePayload {
  tenantId: number;
  expenseId: number;
  authorizedUser: ISystemUser;
  oldExpense: IExpense;
  trx: Knex.Transaction;
}

export interface IExpenseDeletingPayload {
  trx: Knex.Transaction;
  tenantId: number;
  oldExpense: IExpense;
}
export interface IExpenseEventPublishedPayload {
  tenantId: number;
  expenseId: number;
  oldExpense: IExpense;
  expense: IExpense;
  authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface IExpensePublishingPayload {
  trx: Knex.Transaction;
  oldExpense: IExpense;
  tenantId: number;
}
export enum ExpenseAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
}
