import { ISaleReceiptCreatedPayload } from '@/interfaces';
import { SaleReceiptIncrement } from '@/services/Sales/Receipts/SaleReceiptIncrement';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';

@Service()
export default class SaleReceiptAutoSerialSubscriber {
  @Inject()
  private saleReceiptsService: SaleReceiptIncrement;

  /**
   *
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(events.saleReceipt.onCreated, this.handleReceiptNextNumberIncrement);
  }

  /**
   * Handle sale receipt increment next number once be created.
   */
  private handleReceiptNextNumberIncrement = async ({ tenantId, saleReceiptId }: ISaleReceiptCreatedPayload) => {
    await this.saleReceiptsService.incrementNextReceiptNumber(tenantId);
  };
}
