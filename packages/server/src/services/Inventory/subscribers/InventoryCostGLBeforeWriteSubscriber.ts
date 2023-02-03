import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IInventoryCostLotsGLEntriesWriteEvent } from '@/interfaces';
import { InventoryCostGLStorage } from '../InventoryCostGLStorage';

@Service()
export class InventoryCostGLBeforeWriteSubscriber {
  @Inject()
  private inventoryCostGLStorage: InventoryCostGLStorage;

  /**
   * Attaches events.
   */
  public attach(bus) {
    bus.subscribe(
      events.inventory.onCostLotsGLEntriesBeforeWrite,
      this.revertsInventoryCostGLEntries
    );
  }

  /**
   * Writes the receipts cost GL entries once the inventory cost lots be written.
   * @param {IInventoryCostLotsGLEntriesWriteEvent}
   */
  private revertsInventoryCostGLEntries = async ({
    trx,
    startingDate,
    tenantId,
  }: IInventoryCostLotsGLEntriesWriteEvent) => {
    await this.inventoryCostGLStorage.revertInventoryCostGLEntries(
      tenantId,
      startingDate,
      trx
    );
  };
}
