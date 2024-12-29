import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/objection';
import events from '@/subscribers/events';
import {
  IVendorCreditApplyToBillDeletedPayload,
  IVendorCreditApplyToBillsCreatedPayload,
} from '@/interfaces';
import { ApplyVendorCreditSyncBillsService } from '../command/ApplyVendorCreditSyncBills.service';
import { VendorCreditApplyToBill } from '../models/VendorCreditApplyToBill';

@Injectable()
export default class ApplyVendorCreditSyncBillsSubscriber {
  constructor(
    private readonly syncBillsWithVendorCredit: ApplyVendorCreditSyncBillsService,
    @InjectModel(VendorCreditApplyToBill)
    private readonly vendorCreditApplyToBillModel: typeof VendorCreditApplyToBill,
  ) {}

  /**
   * Attaches events with handlers.
   */
  attach(bus) {
    bus.subscribe(
      events.vendorCredit.onApplyToInvoicesCreated,
      this.incrementAppliedBillsOnceCreditCreated
    );
    bus.subscribe(
      events.vendorCredit.onApplyToInvoicesDeleted,
      this.decrementAppliedBillsOnceCreditDeleted
    );
  }

  /**
   * Increment credited amount of applied bills once the vendor credit transaction created.
   * @param {IVendorCreditApplyToBillsCreatedPayload}  paylaod -
   */
  private incrementAppliedBillsOnceCreditCreated = async ({
    vendorCreditAppliedBills,
    trx,
  }: IVendorCreditApplyToBillsCreatedPayload) => {
    await this.syncBillsWithVendorCredit.incrementBillsCreditedAmount(
      vendorCreditAppliedBills,
      trx
    );
  };

  /**
   * Decrement credited amount of applied bills once the vendor credit
   * transaction delted.
   * @param {IVendorCreditApplyToBillDeletedPayload} payload
   */
  private decrementAppliedBillsOnceCreditDeleted = async ({
    oldCreditAppliedToBill,
    trx,
  }: IVendorCreditApplyToBillDeletedPayload) => {
    await this.syncBillsWithVendorCredit.decrementBillCreditedAmount(
      oldCreditAppliedToBill,
      trx
    );
  };
}
