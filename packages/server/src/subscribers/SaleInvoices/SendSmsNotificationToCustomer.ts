import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { SaleInvoiceNotifyBySms } from '@/services/Sales/Invoices/SaleInvoiceNotifyBySms';
import { ISaleInvoiceCreatedPayload } from '@/interfaces';
import { runAfterTransaction } from '@/services/UnitOfWork/TransactionsHooks';

@Service()
export default class SendSmsNotificationToCustomer {
  @Inject()
  private saleInvoiceNotifyBySms: SaleInvoiceNotifyBySms;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.sendSmsNotificationAfterInvoiceCreation
    );
  }

  /**
   * Hnadle sending SMS notification after invoice transaction creation.
   */
  private sendSmsNotificationAfterInvoiceCreation = async ({
    tenantId,
    saleInvoiceId,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload) => {
    // Can't continue if the sale invoice is not marked as delivered.
    if (!saleInvoice.deliveredAt) return;

    // Notify via sms after transactions complete running.
    runAfterTransaction(trx, async () => {
      try {
        await this.saleInvoiceNotifyBySms.notifyDetailsBySmsAfterCreation(
          tenantId,
          saleInvoiceId
        );
      } catch (error) {}
    });
  };
}
