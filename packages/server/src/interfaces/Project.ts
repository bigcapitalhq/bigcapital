import { Knex } from 'knex';

export interface IProjectCommonDTO {
  contactId: number;
  name: string;
  deadline: Date;
  costEstimate: number;
}

export interface IProject {
  id?: number;
  name: string;
  contactId: number;
  deadline: number;
  costEstimate: number;
  status: string;
}

export interface IProjectCreateDTO extends IProjectCommonDTO {}
export interface IProjectEditDTO extends IProjectCommonDTO {}

export interface IProjectCreatePOJO extends IProject {}
export interface IProjectEditPOJO extends IProject {}

export interface IProjectGetPOJO {
  costEstimate: number;
  costEstimateFormatted: string;

  deadlineFormatted: string;
  contactDisplayName: string;
  statusFormatted: string;

  totalActualHours: number;
  totalEstimateHours: number;
  totalInvoicedHours: number;
  totalBillableHours: number;

  totalActualHoursAmount: number;
  totalActualHoursAmountFormatted: string;

  totalEstimateHoursAmount: number;
  totalEstimateHoursAmountFormatted: string;

  totalInvoicedHoursAmount: number;
  totalInvoicedHoursAmountFormatted: string;

  totalBillableHoursAmount: number;
  totalBillableHoursAmountFormatted: string;

  totalExpenses: number;
  totalExpensesFormatted: string;

  totalInvoicedExpenses: number;
  totalInvoicedExpensesFormatted: string;

  totalBillableExpenses: number;
  totalBillableExpensesFormatted: string;

  totalInvoiced: number;
  totalInvoicedFormatted: string;

  totalBillable: number;
  totalBillableFormatted: string;
}

export interface IProjectCreateEventPayload {
  tenantId: number;
  projectDTO: IProjectCreateDTO;
}

export interface IProjectCreatedEventPayload {
  tenantId: number;
  projectDTO: IProjectCreateDTO;
  project: IProject;
  trx: Knex.Transaction;
}

export interface IProjectCreatingEventPayload {
  tenantId: number;
  projectDTO: IProjectCreateDTO;
  trx: Knex.Transaction;
}

export interface IProjectDeleteEventPayload {
  tenantId: number;
  projectId: number;
}

export interface IProjectDeletingEventPayload {
  tenantId: number;
  oldProject: IProject;
  trx: Knex.Transaction;
}

export interface IProjectDeletedEventPayload
  extends IProjectDeletingEventPayload {}

export interface IProjectEditEventPayload {
  tenantId: number;
  oldProject: IProject;
  projectDTO: IProjectEditDTO;
}
export interface IProjectEditingEventPayload {
  tenantId: number;
  oldProject: IProject;
  projectDTO: IProjectEditDTO;
  trx: Knex.Transaction;
}
export interface IProjectEditedEventPayload {
  tenantId: number;
  project: IProject;
  oldProject: IProject;
  projectDTO: IProjectEditDTO;
  trx: Knex.Transaction;
}

export enum IProjectStatus {
  Closed = 'Closed',
  InProgress = 'InProgress',
}

export interface ProjectBillableEntriesQuery {
  toDate?: Date;
  billableType?: ProjectBillableType[];
}

export interface ProjectBillableEntry {
  billableType: string;
  billableId: number;
  billableAmount: number;
  billableCurrency: string;
  billableTransactionNo: string;
}

export enum ProjectBillableType {
  Task = 'Task',
  Expense = 'Expense',
  Bill = 'Bill',
}

export enum ProjectAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
}

export enum ProjectTaskAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
}

export enum ProjectTimeAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
}
