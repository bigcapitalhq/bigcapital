import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { SaleInvoiceSmsNotification } from '../SaleInvoiceSmsNotification';
import { ISaleInvoiceCreatedPayload } from '../SaleInvoice.types';

@Injectable()
export class SaleInvoiceSmsNotificationSubscriber {
  constructor(
    private readonly saleInvoiceSmsNotification: SaleInvoiceSmsNotification,
  ) {}

  /**
   * Handles sending SMS notification after the sale invoice creation.
   * @param {ISaleInvoiceCreatedPayload} payload -
   */
  @OnEvent(events.saleInvoice.onCreated)
  private async handleNotifyBySmsAfterCreation({
    saleInvoiceId,
    trx,
  }: ISaleInvoiceCreatedPayload) {
    runAfterTransaction(trx, async () => {
      try {
        await this.saleInvoiceSmsNotification.notifyDetailsBySmsAfterCreation(
          saleInvoiceId,
        );
      } catch (error) {}
    });
  }
}
