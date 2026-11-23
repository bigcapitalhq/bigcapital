import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Budget } from '../models/Budget';
import { CreateBudgetDto, EditBudgetDto } from '../dtos/Budget.dto';

export enum BudgetAction {
  View = 'View',
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
}

export const ERRORS = {
  BUDGET_ENTRIES_ACCOUNT_NOT_FOUND: 'BUDGET_ENTRIES_ACCOUNT_NOT_FOUND',
  BUDGET_ENTRY_DATE_OUT_OF_RANGE: 'BUDGET_ENTRY_DATE_OUT_OF_RANGE',
  BUDGET_ENTRY_DUPLICATE_DATE: 'BUDGET_ENTRY_DUPLICATE_DATE',
  BUDGET_INVALID_DATE_RANGE: 'BUDGET_INVALID_DATE_RANGE',
};

export interface IBudgetCreatingPayload {
  createBudgetDTO: CreateBudgetDto;
  trx: Knex.Transaction;
}

export interface IBudgetCreatedPayload {
  budget: ModelObject<Budget>;
  createBudgetDTO: CreateBudgetDto;
  trx: Knex.Transaction;
}

export interface IBudgetEditingPayload {
  editBudgetDTO: EditBudgetDto;
  oldBudget: ModelObject<Budget>;
  trx: Knex.Transaction;
}

export interface IBudgetEditedPayload {
  budget: ModelObject<Budget>;
  editBudgetDTO: EditBudgetDto;
  oldBudget: ModelObject<Budget>;
  trx: Knex.Transaction;
}

export interface IBudgetDeletingPayload {
  oldBudget: ModelObject<Budget>;
  trx: Knex.Transaction;
}

export interface IBudgetDeletedPayload {
  budgetId: number;
  oldBudget: ModelObject<Budget>;
  trx: Knex.Transaction;
}
