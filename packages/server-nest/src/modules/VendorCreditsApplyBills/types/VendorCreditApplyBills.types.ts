import { Knex } from 'knex';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';

export interface IVendorCreditApplyToBillsCreatedPayload {
  vendorCredit: VendorCredit;
  vendorCreditAppliedBills: IVendorCreditAppliedBill[];
  trx: Knex.Transaction;
}

export interface IVendorCreditApplyToBillsCreatingPayload {
  trx: Knex.Transaction;
}

export interface IVendorCreditApplyToBillsCreatePayload {
  trx: Knex.Transaction;
}

export interface IVendorCreditApplyToBillDeletedPayload {
  vendorCredit: VendorCredit;
  oldCreditAppliedToBill: IVendorCreditAppliedBill;
  trx: Knex.Transaction;
}

export interface IVendorCreditApplyToInvoiceDTO {
  amount: number;
  billId: number;
}

export interface IVendorCreditApplyToInvoicesDTO {
  entries: IVendorCreditApplyToInvoiceDTO[];
}

export interface IVendorCreditApplyToInvoiceModel {
  billId: number;
  amount: number;
  vendorCreditId: number;
}

export interface IVendorCreditApplyToInvoicesModel {
  entries: IVendorCreditApplyToInvoiceModel[];
  amount: number;
}

export interface IVendorCreditAppliedBill {
  billId: number;
  amount: number;
  vendorCreditId: number;
}
