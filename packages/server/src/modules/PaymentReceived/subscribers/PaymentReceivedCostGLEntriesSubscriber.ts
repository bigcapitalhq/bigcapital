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
   * Re-writes the cash basis inventory cost entries of the payments received
   * once the inventory cost lots be written.
   * @param {IInventoryCostLotsGLEntriesWriteEvent} payload
   */
  @OnEvent(events.inventory.onCostLotsGLEntriesWrite)
  public async writePaymentsCostEntriesOnCostLotsWritten({
    trx,
    startingDate,
  }: IInventoryCostLotsGLEntriesWriteEvent) {
    await this.paymentReceivedCostGLEntries.writePaymentsCostGLEntriesSince(
      startingDate,
      trx,
    );
  }
}
