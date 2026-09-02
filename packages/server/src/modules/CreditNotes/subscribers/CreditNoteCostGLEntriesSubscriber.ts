import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IInventoryCostLotsGLEntriesWriteEvent } from '@/modules/InventoryCost/types/InventoryCost.types';
import { CreditNoteCostGLEntries } from '../commands/CreditNoteCostGLEntries';

@Injectable()
export class CreditNoteCostGLEntriesSubscriber {
  constructor(
    private readonly creditNoteCostEntries: CreditNoteCostGLEntries,
  ) {}

  @OnEvent(events.inventory.onCostLotsGLEntriesWrite)
  async writeCreditNoteCostEntriesOnCostLotsWritten({
    trx,
    startingDate,
  }: IInventoryCostLotsGLEntriesWriteEvent) {
    await this.creditNoteCostEntries.writeInventoryCostJournalEntries(
      startingDate,
      trx,
    );
  }
}
