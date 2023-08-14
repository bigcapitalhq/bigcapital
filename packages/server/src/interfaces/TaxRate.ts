import { Knex } from 'knex';

export interface ITaxRate {}

export interface ICommonTaxRateDTO {
  name: string;
  code: string;
  rate: number;
  IsNonRecoverable: boolean;
  IsCompound: boolean;
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
export interface ITaxRateDeletedPayload {
  oldTaxRate: ITaxRate;
  tenantId: number;
  trx: Knex.Transaction;
}


export interface ITaxTransaction {
  taxAmount: number;
  taxName: string;
  taxCode: string;
}