import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IInventoryCostLotsGLEntriesWriteEvent } from '../types/InventoryCost.types';
import { InventoryCostGLStorage } from '../commands/InventoryCostGLStorage.service';

@Injectable()
export class InventoryCostGLBeforeWriteSubscriber {
  constructor(
    private readonly inventoryCostGLStorage: InventoryCostGLStorage,
  ) {}

  /**
   * Writes the receipts cost GL entries once the inventory cost lots be written.
   * @param {IInventoryCostLotsGLEntriesWriteEvent}
   */
  @OnEvent(events.inventory.onCostLotsGLEntriesBeforeWrite)
  public async revertsInventoryCostGLEntries({
    trx,
    startingDate,
  }: IInventoryCostLotsGLEntriesWriteEvent) {
    await this.inventoryCostGLStorage.revertInventoryCostGLEntries(
      startingDate,
      trx,
    );
  }
}
