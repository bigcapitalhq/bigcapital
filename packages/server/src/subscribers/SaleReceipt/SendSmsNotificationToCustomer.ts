import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { SaleReceiptNotifyBySms } from '@/services/Sales/Receipts/SaleReceiptNotifyBySms';
import { ISaleReceiptCreatedPayload } from '@/interfaces';
import { runAfterTransaction } from '@/services/UnitOfWork/TransactionsHooks';

@Service()
export default class SendSmsNotificationSaleReceipt {
  @Inject()
  private saleReceiptNotifyBySms: SaleReceiptNotifyBySms;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleReceipt.onCreated,
      this.handleNotifyViaSmsAfterReceiptCreation
    );
  }

  /**
   * Notify via SMS message after receipt transaction creation.
   * @param {ISaleReceiptCreatedPayload} payload -
   */
  private handleNotifyViaSmsAfterReceiptCreation = ({
    tenantId,
    saleReceiptId,
    saleReceipt,
    trx,
  }: ISaleReceiptCreatedPayload) => {
    // Can't continue if the sale receipt is not closed.
    if (!saleReceipt.isClosed) return;

    // Notify via sms after transaction complete running.
    runAfterTransaction(trx, async () => {
      try {
        await this.saleReceiptNotifyBySms.notifyViaSmsAfterCreation(
          tenantId,
          saleReceiptId
        );
      } catch (error) {}
    });
  };
}
