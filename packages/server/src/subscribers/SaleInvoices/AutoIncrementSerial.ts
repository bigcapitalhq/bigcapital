import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { SaleInvoiceIncrement } from '@/services/Sales/Invoices/SaleInvoiceIncrement';
import { ISaleInvoiceCreatedPayload } from '@/interfaces';

@Service()
export default class SaleInvoiceAutoIncrementSubscriber extends EventSubscriber {
  @Inject()
  private saleInvoicesService: SaleInvoiceIncrement;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleInvoiceNextNumberIncrement
    );
  }

  /**
   * Handles sale invoice next number increment once invoice created.
   * @param {ISaleInvoiceCreatedPayload} payload -
   */
  private handleInvoiceNextNumberIncrement = async ({
    tenantId,
  }: ISaleInvoiceCreatedPayload) => {
    await this.saleInvoicesService.incrementNextInvoiceNumber(tenantId);
  };
}
