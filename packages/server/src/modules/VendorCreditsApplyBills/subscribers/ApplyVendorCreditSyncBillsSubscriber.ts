import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IVendorCreditApplyToBillsCreatedPayload,
  IVendorCreditApplyToBillDeletedPayload,
} from '../types/VendorCreditApplyBills.types';
import { ApplyVendorCreditSyncBillsService } from '../command/ApplyVendorCreditSyncBills.service';

@Injectable()
export class ApplyVendorCreditSyncBillsSubscriber {
  constructor(
    private readonly syncBillsWithVendorCredit: ApplyVendorCreditSyncBillsService,
  ) {}

  /**
   * Increments the credited amount of applied bills once the vendor credit
   * apply transaction is created.
   * @param {IVendorCreditApplyToBillsCreatedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onApplyToInvoicesCreated)
  async incrementAppliedBillsOnceCreditCreated({
    vendorCreditAppliedBills,
    trx,
  }: IVendorCreditApplyToBillsCreatedPayload) {
    await this.syncBillsWithVendorCredit.incrementBillsCreditedAmount(
      vendorCreditAppliedBills,
      trx,
    );
  }

  /**
   * Decrements the credited amount of the applied bill once the vendor credit
   * apply transaction is deleted.
   * @param {IVendorCreditApplyToBillDeletedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onApplyToInvoicesDeleted)
  async decrementAppliedBillsOnceCreditDeleted({
    oldCreditAppliedToBill,
    trx,
  }: IVendorCreditApplyToBillDeletedPayload) {
    await this.syncBillsWithVendorCredit.decrementBillCreditedAmount(
      oldCreditAppliedToBill,
      trx,
    );
  }
}
