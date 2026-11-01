import { Injectable } from '@nestjs/common';
import { sumBy } from 'lodash';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IVendorCreditApplyToBillsCreatedPayload,
  IVendorCreditApplyToBillDeletedPayload,
} from '../types/VendorCreditApplyBills.types';
import { ApplyVendorCreditSyncInvoicedService } from '../command/ApplyVendorCreditSyncInvoiced.service';

@Injectable()
export class ApplyVendorCreditSyncInvoicedSubscriber {
  constructor(
    private readonly syncCreditWithInvoiced: ApplyVendorCreditSyncInvoicedService,
  ) {}

  /**
   * Increments the vendor credit invoiced amount once the apply transaction
   * is created.
   * @param {IVendorCreditApplyToBillsCreatedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onApplyToInvoicesCreated)
  async incrementInvoicedAmountOnceCreditApplied({
    vendorCredit,
    vendorCreditAppliedBills,
    trx,
  }: IVendorCreditApplyToBillsCreatedPayload) {
    const amount = sumBy(vendorCreditAppliedBills, 'amount');

    await this.syncCreditWithInvoiced.incrementVendorCreditInvoicedAmount(
      vendorCredit.id,
      amount,
      trx,
    );
  }

  /**
   * Decrements the vendor credit invoiced amount once the apply transaction
   * is deleted.
   * @param {IVendorCreditApplyToBillDeletedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onApplyToInvoicesDeleted)
  async decrementInvoicedAmountOnceCreditApplyDeleted({
    oldCreditAppliedToBill,
    trx,
  }: IVendorCreditApplyToBillDeletedPayload) {
    await this.syncCreditWithInvoiced.decrementVendorCreditInvoicedAmount(
      oldCreditAppliedToBill.vendorCreditId,
      oldCreditAppliedToBill.amount,
      trx,
    );
  }
}
