import { Knex } from 'knex';

export interface ITaxRate {
  id?: number;
  name: string;
  code: string;
  rate: number;
  description: string;
  IsNonRecoverable: boolean;
  IsCompound: boolean;
  active: boolean;
}

export interface ICommonTaxRateDTO {
  name: string;
  code: string;
  rate: number;
  description: string;
  IsNonRecoverable: boolean;
  IsCompound: boolean;
  active: boolean;
}
export interface ICreateTaxRateDTO extends ICommonTaxRateDTO {}
export interface IEditTaxRateDTO extends ICommonTaxRateDTO {}

export interface ITaxRateCreatingPayload {
  createTaxRateDTO: ICreateTaxRateDTO;
  tenantId: number;
  trx: Knex.Transaction;
}
export interface ITaxRateCreatedPayload {
  createTaxRateDTO: ICreateTaxRateDTO;
  taxRate: ITaxRate;
  tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxRateEditingPayload {
  oldTaxRate: ITaxRate;
  editTaxRateDTO: IEditTaxRateDTO;
  tenantId: number;
  trx: Knex.Transaction;
}
export interface ITaxRateEditedPayload {
  editTaxRateDTO: IEditTaxRateDTO;
  oldTaxRate: ITaxRate;
  taxRate: ITaxRate;
  tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxRateDeletingPayload {
  oldTaxRate: ITaxRate;
  tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxRateActivatingPayload {
  taxRateId: number;
  tenantId: number;
  trx: Knex.Transaction;
}
export interface ITaxRateActivatedPayload {
  taxRateId: number;
  tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxRateDeletedPayload {
  oldTaxRate: ITaxRate;
  tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxTransaction {
  id?: number;
  taxRateId: number;
  referenceType: string;
  referenceId: number;
  rate: number;
  taxAccountId: number;
}

export enum TaxRateAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
}
