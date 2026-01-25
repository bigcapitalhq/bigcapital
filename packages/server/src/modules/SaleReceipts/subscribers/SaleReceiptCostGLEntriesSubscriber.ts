import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IInventoryCostLotsGLEntriesWriteEvent } from '@/modules/InventoryCost/types/InventoryCost.types';
import { SaleReceiptCostGLEntries } from '../SaleReceiptCostGLEntries';

@Injectable()
export class SaleReceiptCostGLEntriesSubscriber {
  constructor(
    private readonly saleReceiptCostEntries: SaleReceiptCostGLEntries,
  ) {}

  /**
   * Writes the receipts cost GL entries once the inventory cost lots are written.
   */
  @OnEvent(events.inventory.onCostLotsGLEntriesWrite)
  async writeReceiptsCostEntriesOnCostLotsWritten({
    trx,
    startingDate,
  }: IInventoryCostLotsGLEntriesWriteEvent) {
    await this.saleReceiptCostEntries.writeInventoryCostJournalEntries(
      startingDate,
      trx,
    );
  }
}
