import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import SalesReceiptService from '@/services/Sales/SalesReceipts';
import { ISaleReceiptCreatedPayload } from '@/interfaces';

@Service()
export default class SaleReceiptAutoSerialSubscriber {
  @Inject()
  saleReceiptsService: SalesReceiptService;

  /**
   *
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.saleReceipt.onCreated,
      this.handleReceiptNextNumberIncrement
    );
  }

  /**
   * Handle sale receipt increment next number once be created.
   */
  private handleReceiptNextNumberIncrement = async ({
    tenantId,
    saleReceiptId,
  }: ISaleReceiptCreatedPayload) => {
    await this.saleReceiptsService.incrementNextReceiptNumber(tenantId);
  };
}
