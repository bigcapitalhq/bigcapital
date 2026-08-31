import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { SaleReceiptSmsNotification } from '../SaleReceiptSmsNotification';
import { ISaleReceiptCreatedPayload } from '../types/SaleReceipts.types';

@Injectable()
export class SaleReceiptSmsNotificationSubscriber {
  constructor(
    private readonly saleReceiptSmsNotification: SaleReceiptSmsNotification,
  ) {}

  /**
   * Handles sending SMS notification after the sale receipt creation.
   * @param {ISaleReceiptCreatedPayload} payload -
   */
  @OnEvent(events.saleReceipt.onCreated)
  private async handleNotifyBySmsAfterCreation({
    saleReceiptId,
    trx,
  }: ISaleReceiptCreatedPayload) {
    runAfterTransaction(trx, async () => {
      try {
        await this.saleReceiptSmsNotification.notifyDetailsBySmsAfterCreation(
          saleReceiptId,
        );
      } catch (error) {}
    });
  }
}
