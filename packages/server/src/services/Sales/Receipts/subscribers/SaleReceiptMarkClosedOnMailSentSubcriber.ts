import { ISaleReceiptMailPresend } from '@/interfaces';
import events from '@/subscribers/events';
import { CloseSaleReceipt } from '../CloseSaleReceipt';
import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { ERRORS } from '../constants';

@Service()
export class SaleReceiptMarkClosedOnMailSentSubcriber {
  @Inject()
  private closeReceiptService: CloseSaleReceipt;

  /**
   * Attaches events.
   */
  public attach(bus) {
    bus.subscribe(events.saleReceipt.onPreMailSend, this.markReceiptClosed);
  }

  /**
   * Marks the sale receipt closed on submitting mail.
   * @param {ISaleReceiptMailPresend}
   */
  private markReceiptClosed = async ({
    tenantId,
    saleReceiptId,
    messageOptions,
  }: ISaleReceiptMailPresend) => {
    try {
      await this.closeReceiptService.closeSaleReceipt(tenantId, saleReceiptId);
    } catch (error) {
      if (
        error instanceof ServiceError &&
        error.errorType === ERRORS.SALE_RECEIPT_IS_ALREADY_CLOSED
      ) {
      } else {
        throw error;
      }
    }
  };
}
