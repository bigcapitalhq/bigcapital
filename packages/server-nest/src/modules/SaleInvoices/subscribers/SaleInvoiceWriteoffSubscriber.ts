import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ISaleInvoiceWriteoffCreatePayload,
  ISaleInvoiceWrittenOffCanceledPayload,
} from '../SaleInvoice.types';
import { SaleInvoiceWriteoffGLStorage } from '../commands/writeoff/SaleInvoiceWriteoffGLStorage';
import { events } from '@/common/events/events';

@Injectable()
export class SaleInvoiceWriteoffSubscriber {
  constructor(private readonly writeGLStorage: SaleInvoiceWriteoffGLStorage) {}

  /**
   * Write the written-off sale invoice journal entries.
   * @param {ISaleInvoiceWriteoffCreatePayload}
   */
  @OnEvent(events.saleInvoice.onWrittenoff)
  public async writeJournalEntriesOnceWriteoffCreate({
    saleInvoice,
    trx,
  }: ISaleInvoiceWriteoffCreatePayload) {
    await this.writeGLStorage.writeInvoiceWriteoffEntries(saleInvoice.id, trx);
  }

  /**
   * Reverts the written-of sale invoice jounral entries.
   * @param {ISaleInvoiceWrittenOffCanceledPayload}
   */
  @OnEvent(events.saleInvoice.onWrittenoffCanceled)
  public async revertJournalEntriesOnce({
    saleInvoice,
    trx,
  }: ISaleInvoiceWrittenOffCanceledPayload) {
    await this.writeGLStorage.revertInvoiceWriteoffEntries(saleInvoice.id, trx);
  }
}
