import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IInventoryCostLotsGLEntriesWriteEvent } from '@/interfaces';
import { SaleInvoiceCostGLEntries } from '../SaleInvoiceCostGLEntries';

@Service()
export class InvoiceCostGLEntriesSubscriber {
  @Inject()
  invoiceCostEntries: SaleInvoiceCostGLEntries;

  /**
   * Attaches events.
   */
  public attach(bus) {
    bus.subscribe(
      events.inventory.onCostLotsGLEntriesWrite,
      this.writeInvoicesCostEntriesOnCostLotsWritten
    );
  }

  /**
   * Writes the invoices cost GL entries once the inventory cost lots be written.
   * @param {IInventoryCostLotsGLEntriesWriteEvent}
   */
  private writeInvoicesCostEntriesOnCostLotsWritten = async ({
    trx,
    startingDate,
    tenantId,
  }: IInventoryCostLotsGLEntriesWriteEvent) => {
    await this.invoiceCostEntries.writeInventoryCostJournalEntries(
      tenantId,
      startingDate,
      trx
    );
  };
}
