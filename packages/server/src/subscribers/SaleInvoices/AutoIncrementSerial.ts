import { ISaleInvoiceCreatedPayload } from '@/interfaces';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { SaleInvoiceIncrement } from '@/services/Sales/Invoices/SaleInvoiceIncrement';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';

@Service()
export default class SaleInvoiceAutoIncrementSubscriber extends EventSubscriber {
  @Inject()
  private saleInvoicesService: SaleInvoiceIncrement;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(events.saleInvoice.onCreated, this.handleInvoiceNextNumberIncrement);
  }

  /**
   * Handles sale invoice next number increment once invoice created.
   * @param {ISaleInvoiceCreatedPayload} payload -
   */
  private handleInvoiceNextNumberIncrement = async ({ tenantId }: ISaleInvoiceCreatedPayload) => {
    await this.saleInvoicesService.incrementNextInvoiceNumber(tenantId);
  };
}
