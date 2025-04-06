import { Knex } from 'knex';
import { RefundVendorCredit } from '../models/RefundVendorCredit';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';

export interface IRefundVendorCreditDTO {
  amount: number;
  exchangeRate?: number;
  depositAccountId: number;
  description: string;
  date: Date;
  branchId?: number;
}

export interface IRefundVendorCreditDeletedPayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: RefundVendorCredit;
}

export interface IRefundVendorCreditDeletePayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: RefundVendorCredit;
}

export interface IRefundVendorCreditDeletingPayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: RefundVendorCredit;
}

export interface IRefundVendorCreditCreatingPayload {
  trx: Knex.Transaction;
  vendorCredit: VendorCredit;
  refundVendorCreditDTO: IRefundVendorCreditDTO;
}

export interface IRefundVendorCreditCreatedPayload {
  refundVendorCredit: RefundVendorCredit;
  vendorCredit: VendorCredit;
  trx: Knex.Transaction;
}

export interface IRefundVendorCreditPOJO {}
