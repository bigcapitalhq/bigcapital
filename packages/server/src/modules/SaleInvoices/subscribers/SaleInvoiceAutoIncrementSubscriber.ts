import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { SaleInvoiceIncrement } from '../commands/SaleInvoiceIncrement.service';
import { ISaleInvoiceCreatedPayload } from '../SaleInvoice.types';

@Injectable()
export class SaleInvoiceAutoIncrementSubscriber {
  constructor(private readonly invoiceIncrement: SaleInvoiceIncrement) { }

  /**
   * Handles increment next number of invoice once be created.
   * @param {ISaleInvoiceCreatedPayload} payload -
   */
  @OnEvent(events.saleInvoice.onCreated)
  private async handleInvoiceNextNumberIncrement({ }: ISaleInvoiceCreatedPayload) {
    await this.invoiceIncrement.incrementNextInvoiceNumber();
  }
}
