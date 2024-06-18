import { Knex } from 'knex';

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
  createRuleDTO: ICreateBankRuleDTO;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventCreatedPayload {
  createRuleDTO: ICreateBankRuleDTO;
  trx?: Knex.Transaction;
}

export interface IBankRuleEventEditingPayload {
  ruleId: number;
  oldBankRule: any;
  editRuleDTO: IEditBankRuleDTO;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventEditedPayload {
  ruleId: number;
  editRuleDTO: IEditBankRuleDTO;
  trx?: Knex.Transaction;
}

export interface IBankRuleEventDeletingPayload {
  oldBankRule: any;
  ruleId: number;
  trx?: Knex.Transaction;
}
export interface IBankRuleEventDeletedPayload {
  ruleId: number;
  trx?: Knex.Transaction;
}
