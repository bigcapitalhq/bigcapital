import { ISystemUser } from "./User";

export interface IPaginationMeta {
  total: number,
  page: number,
  pageSize: number,
};

export interface IExpensesFilter{
  page: number,
  pageSize: number,
};

export interface IExpense {
  id: number,
  totalAmount: number,
  currencyCode: string,
  description?: string,
  paymentAccountId: number,
  peyeeId?: number,
  referenceNo?: string,
  publishedAt: Date|null,
  userId: number,
  paymentDate: Date,
  payeeId: number,
  categories: IExpenseCategory[],
}

export interface IExpenseCategory {
  expenseAccountId: number,
  index: number,
  description: string,
  expenseId: number,
  amount: number,
}

export interface IExpenseDTO {
  currencyCode: string,
  description?: string,
  paymentAccountId: number,
  peyeeId?: number,
  referenceNo?: string,
  publish: boolean,
  userId: number,
  paymentDate: Date,
  payeeId: number,
  categories: IExpenseCategoryDTO[],
}

export interface IExpenseCategoryDTO {
  expenseAccountId: number,
  index: number,
  description?: string,
  expenseId: number,
};

export interface IExpensesService {
  newExpense(tenantid: number, expenseDTO: IExpenseDTO, authorizedUser: ISystemUser): Promise<IExpense>;
  editExpense(tenantid: number, expenseId: number, expenseDTO: IExpenseDTO, authorizedUser: ISystemUser): void;

  publishExpense(tenantId: number, expenseId: number, authorizedUser: ISystemUser): Promise<void>;

  deleteExpense(tenantId: number, expenseId: number, authorizedUser: ISystemUser): Promise<void>;
  deleteBulkExpenses(tenantId: number, expensesIds: number[], authorizedUser: ISystemUser): Promise<void>;

  publishBulkExpenses(tenantId: number, expensesIds: number[], authorizedUser: ISystemUser): Promise<void>;

  getExpensesList(tenantId: number, expensesFilter: IExpensesFilter): Promise<{ expenses: IExpense[], pagination: IPaginationMeta, filterMeta: IFilterMeta }>;
  getExpense(tenantId: number, expenseId: number): Promise<IExpense>;
}