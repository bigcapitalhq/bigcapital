import { ISystemUser } from "./User";

export interface IExpense {
  id: number,
  totalAmount: number,
  currencyCode: string,
  description?: string,
  paymentAccountId: number,
  peyeeId?: number,
  referenceNo?: string,
  published: boolean,
  userId: number,
  paymentDate: Date,

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
  published: boolean,
  userId: number,
  paymentDate: Date,

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
}