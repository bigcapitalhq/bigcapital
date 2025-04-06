import Bluebird from 'bluebird';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { IVendorCreditAppliedBill } from '../types/VendorCreditApplyBills.types';
import { Bill } from '@/modules/Bills/models/Bill';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class ApplyVendorCreditSyncBillsService {
  constructor(
    @Inject(Bill.name)
    private readonly billModel: TenantModelProxy<typeof Bill>,
  ) {}

  /**
   * Increment bills credited amount.
   * @param {IVendorCreditAppliedBill[]} vendorCreditAppliedBills
   * @param {Knex.Transaction} trx
   */
  public incrementBillsCreditedAmount = async (
    vendorCreditAppliedBills: IVendorCreditAppliedBill[],
    trx?: Knex.Transaction,
  ) => {
    await Bluebird.each(
      vendorCreditAppliedBills,
      (vendorCreditAppliedBill: IVendorCreditAppliedBill) => {
        return this.billModel()
          .query(trx)
          .where('id', vendorCreditAppliedBill.billId)
          .increment('creditedAmount', vendorCreditAppliedBill.amount);
      },
    );
  };

  /**
   * Decrement bill credited amount.
   * @param {IVendorCreditAppliedBill} vendorCreditAppliedBill
   * @param {Knex.Transaction} trx
   */
  public decrementBillCreditedAmount = async (
    vendorCreditAppliedBill: IVendorCreditAppliedBill,
    trx?: Knex.Transaction,
  ) => {
    await this.billModel()
      .query(trx)
      .findById(vendorCreditAppliedBill.billId)
      .decrement('creditedAmount', vendorCreditAppliedBill.amount);
  };
}
