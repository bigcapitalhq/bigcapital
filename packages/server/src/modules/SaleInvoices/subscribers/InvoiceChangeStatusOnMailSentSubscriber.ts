import { Injectable } from '@nestjs/common';
import { DeliverSaleInvoice } from '../commands/DeliverSaleInvoice.service';
import { ERRORS } from '../constants';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ISaleInvoiceMailSent } from '../SaleInvoice.types';

@Injectable()
export class InvoiceChangeStatusOnMailSentSubscriber {
  constructor(private readonly markInvoiceDelivedService: DeliverSaleInvoice) {}

  /**
   * Marks the invoice delivered once the invoice mail sent.
   * @param {ISaleInvoiceMailSent}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleInvoice.onMailReminderSent)
  @OnEvent(events.saleInvoice.onMailSent)
  async markInvoiceDelivered({
    saleInvoiceId,
    messageOptions,
  }: ISaleInvoiceMailSent) {
    try {
      await this.markInvoiceDelivedService.deliverSaleInvoice(saleInvoiceId);
    } catch (error) {
      if (
        error instanceof ServiceError &&
        error.errorType === ERRORS.SALE_INVOICE_ALREADY_DELIVERED
      ) {
      } else {
        throw error;
      }
    }
  }
}
