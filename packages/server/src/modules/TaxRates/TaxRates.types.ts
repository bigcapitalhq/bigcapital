import { Knex } from 'knex';
import { TaxRateModel } from './models/TaxRate.model';

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
  // tenantId: number;
  trx: Knex.Transaction;
}
export interface ITaxRateCreatedPayload {
  createTaxRateDTO: ICreateTaxRateDTO;
  taxRate: TaxRateModel;
  // tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxRateEditingPayload {
  oldTaxRate: TaxRateModel;
  editTaxRateDTO: IEditTaxRateDTO;
  // tenantId: number;
  trx: Knex.Transaction;
}
export interface ITaxRateEditedPayload {
  editTaxRateDTO: IEditTaxRateDTO;
  oldTaxRate: TaxRateModel;
  taxRate: TaxRateModel;
  // tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxRateDeletingPayload {
  oldTaxRate: TaxRateModel;
  // tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxRateActivatingPayload {
  taxRateId: number;
  // tenantId: number;
  trx: Knex.Transaction;
}
export interface ITaxRateActivatedPayload {
  taxRateId: number;
  // tenantId: number;
  trx: Knex.Transaction;
}

export interface ITaxRateDeletedPayload {
  oldTaxRate: TaxRateModel;
  // tenantId: number;
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
