import { Knex } from 'knex';

export enum BankRuleConditionField {
  Amount = 'Amount',
  Description = 'Description',
  Payee = 'Payee',
}

export enum BankRuleConditionComparator {
  Contains = 'contains',
  Equals = 'equals',
  NotContain = 'not_contain',
}

export interface IBankRuleCondition {
  id?: number;
  field: BankRuleConditionField;
  comparator: BankRuleConditionComparator;
  value: string;
}

export enum BankRuleConditionType {
  Or = 'or',
  And = 'and',
}

export enum BankRuleApplyIfTransactionType {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
}

export interface IBankRule {
  id?: number;
  name: string;
  order?: number;
  applyIfAccountId: number;
  applyIfTransactionType: BankRuleApplyIfTransactionType;

  conditionsType: BankRuleConditionType;
  conditions: IBankRuleCondition[];

  assignCategory: BankRuleAssignCategory;
  assignAccountId: number;
  assignPayee?: string;
  assignMemo?: string;
}

export enum BankRuleAssignCategory {
  InterestIncome = 'InterestIncome',
  OtherIncome = 'OtherIncome',
  Deposit = 'Deposit',
  Expense = 'Expense',
  OwnerDrawings = 'OwnerDrawings',
}

export interface IBankRuleConditionDTO {
  id?: number;
  field: string;
  comparator: string;
  value: number;
}

export interface IBankRuleCommonDTO {
  name: string;
  order?: number;
  applyIfAccountId: number;
  applyIfTransactionType: string;

  conditions: IBankRuleConditionDTO[];

  assignCategory: BankRuleAssignCategory;
  assignAccountId: number;
  assignPayee?: string;
  assignMemo?: string;
}

export interface ICreateBankRuleDTO extends IBankRuleCommonDTO {}
export interface IEditBankRuleDTO extends IBankRuleCommonDTO {}

export interface IBankRuleEventCreatingPayload {
  tenantId: number;
  createRuleDTO: ICreateBankRuleDTO;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventCreatedPayload {
  tenantId: number;
  createRuleDTO: ICreateBankRuleDTO;
  bankRule: IBankRule;
  trx?: Knex.Transaction;
}

export interface IBankRuleEventEditingPayload {
  tenantId: number;
  ruleId: number;
  oldBankRule: any;
  editRuleDTO: IEditBankRuleDTO;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventEditedPayload {
  tenantId: number;
  ruleId: number;
  editRuleDTO: IEditBankRuleDTO;
  trx?: Knex.Transaction;
}

export interface IBankRuleEventDeletingPayload {
  tenantId: number;
  oldBankRule: any;
  ruleId: number;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventDeletedPayload {
  tenantId: number;
  ruleId: number;
  trx?: Knex.Transaction;
}
