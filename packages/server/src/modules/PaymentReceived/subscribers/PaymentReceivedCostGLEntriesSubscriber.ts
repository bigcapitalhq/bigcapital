import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IInventoryCostLotsGLEntriesWriteEvent } from '@/modules/InventoryCost/types/InventoryCost.types';
import { PaymentReceivedCostGLEntries } from '../commands/PaymentReceivedCostGLEntries';

@Injectable()
export class PaymentReceivedCostGLEntriesSubscriber {
  constructor(
    private readonly paymentReceivedCostGLEntries: PaymentReceivedCostGLEntries,
  ) {}

  /**
   * Rewrites the payments cost GL entries once the inventory cost lots are
   * written, since the cash basis cost entries mirror the invoice costs
   * scaled by the paid proportion of each invoice.
   * @param {IInventoryCostLotsGLEntriesWriteEvent}
   */
  @OnEvent(events.inventory.onCostLotsGLEntriesWrite)
  async rewritePaymentsCostEntriesOnCostLotsWritten({
    trx,
    startingDate,
  }: IInventoryCostLotsGLEntriesWriteEvent) {
    await this.paymentReceivedCostGLEntries.writePaymentsCostGLEntries(
      startingDate,
      trx,
    );
  }
}
