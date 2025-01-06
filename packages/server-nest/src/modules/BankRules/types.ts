import { Knex } from 'knex';
import { BankRule } from './models/BankRule';

export enum BankRuleConditionField {
  Amount = 'amount',
  Description = 'description',
  Payee = 'payee',
}

export enum BankRuleConditionComparator {
  Contains = 'contains',
  Equals = 'equals',
  Equal = 'equal',
  NotContain = 'not_contains',
  Bigger = 'bigger',
  BiggerOrEqual = 'bigger_or_equal',
  Smaller = 'smaller',
  SmallerOrEqual = 'smaller_or_equal',
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

// export interface BankRule {
//   id?: number;
//   name: string;
//   order?: number;
//   applyIfAccountId: number;
//   applyIfTransactionType: BankRuleApplyIfTransactionType;

//   conditionsType: BankRuleConditionType;
//   conditions: IBankRuleCondition[];

//   assignCategory: BankRuleAssignCategory;
//   assignAccountId: number;
//   assignPayee?: string;
//   assignMemo?: string;
// }

export enum BankRuleAssignCategory {
  InterestIncome = 'InterestIncome',
  OtherIncome = 'OtherIncome',
  Deposit = 'Deposit',
  Expense = 'Expense',
  OwnerDrawings = 'OwnerDrawings',
}

export type BankRuleComparator =
  | 'contains'
  | 'equals'
  | 'not_contains'
  | 'equal'
  | 'bigger'
  | 'bigger_or_equal'
  | 'smaller'
  | 'smaller_or_equal';

export interface IBankRuleConditionDTO {
  id?: number;
  field: string;
  comparator: BankRuleComparator;
  value: string;
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
  createRuleDTO: ICreateBankRuleDTO;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventCreatedPayload {
  createRuleDTO: ICreateBankRuleDTO;
  bankRule: BankRule;
  trx?: Knex.Transaction;
}

export interface IBankRuleEventEditingPayload {
  ruleId: number;
  oldBankRule: any;
  editRuleDTO: IEditBankRuleDTO;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventEditedPayload {
  oldBankRule: BankRule;
  bankRule: BankRule;
  editRuleDTO: IEditBankRuleDTO;
  trx?: Knex.Transaction;
}

export interface IBankRuleEventDeletingPayload {
  oldBankRule: any;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventDeletedPayload {
  ruleId: number;
  trx?: Knex.Transaction;
}
