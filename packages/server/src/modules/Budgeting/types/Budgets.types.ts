export enum BudgetStatus {
  Draft = 'draft',
  Active = 'active',
  Closed = 'closed',
}

export enum BudgetType {
  ProfitAndLoss = 'profit_and_loss',
  BalanceSheet = 'balance_sheet',
}

export enum PeriodType {
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual',
}

export enum BudgetAction {
  View = 'View',
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
}

export interface IBudgetCreatedPayload {
  budget;
  trx;
}

export interface IBudgetEditingPayload {
  budgetId: number;
  budgetDTO;
  trx;
}

export interface IBudgetEditedPayload {
  budget;
  budgetDTO;
  trx;
}

export interface IBudgetDeletingPayload {
  budgetId: number;
  trx;
}

export interface IBudgetDeletedPayload {
  budgetId: number;
  trx;
}

export interface IBudgetActivatingPayload {
  budgetId: number;
  trx;
}

export interface IBudgetActivatedPayload {
  budget;
  trx;
}

export interface IBudgetClosingPayload {
  budgetId: number;
  trx;
}

export interface IBudgetClosedPayload {
  budget;
  trx;
}
