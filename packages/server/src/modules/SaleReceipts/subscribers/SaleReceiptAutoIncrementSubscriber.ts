import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { SaleReceiptIncrement } from '../commands/SaleReceiptIncrement.service';
import { ISaleReceiptCreatedPayload } from '../types/SaleReceipts.types';

@Injectable()
export class SaleReceiptAutoIncrementSubscriber {
  constructor(private readonly receiptIncrement: SaleReceiptIncrement) { }

  /**
   * Handles increment next number of receipt once be created.
   * @param {ISaleReceiptCreatedPayload} payload -
   */
  @OnEvent(events.saleReceipt.onCreated)
  private async handleReceiptNextNumberIncrement({ }: ISaleReceiptCreatedPayload) {
    await this.receiptIncrement.incrementNextReceiptNumber();
  }
}
