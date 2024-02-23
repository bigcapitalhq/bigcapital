import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IInventoryCostLotsGLEntriesWriteEvent } from '@/interfaces';
import { SaleReceiptCostGLEntries } from '../SaleReceiptCostGLEntries';

@Service()
export class SaleReceiptCostGLEntriesSubscriber {
  @Inject()
  private saleReceiptCostEntries: SaleReceiptCostGLEntries;

  /**
   * Attaches events.
   */
  public attach(bus) {
    bus.subscribe(
      events.inventory.onCostLotsGLEntriesWrite,
      this.writeJournalEntriesOnceWriteoffCreate
    );
  }

  /**
   * Writes the receipts cost GL entries once the inventory cost lots be written.
   * @param {IInventoryCostLotsGLEntriesWriteEvent}
   */
  private writeJournalEntriesOnceWriteoffCreate = async ({
    trx,
    startingDate,
    tenantId,
  }: IInventoryCostLotsGLEntriesWriteEvent) => {
    await this.saleReceiptCostEntries.writeInventoryCostJournalEntries(
      tenantId,
      startingDate,
      trx
    );
  };
}
