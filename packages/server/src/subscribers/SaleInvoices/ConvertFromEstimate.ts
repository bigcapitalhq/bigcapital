import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import SaleEstimateService from '@/services/Sales/SalesEstimate';
import { ISaleInvoiceCreatedPayload } from '@/interfaces';

@Service()
export default class SaleInvoiceConvertFromEstimateSubscriber extends EventSubscriber {
  @Inject()
  saleEstimatesService: SaleEstimateService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleMarkEstimateConvertOnceInvoiceCreated
    );
  }

  /**
   * Marks the sale estimate as converted from the sale invoice once created.
   */
  private handleMarkEstimateConvertOnceInvoiceCreated = async ({
    tenantId,
    saleInvoice,
    saleInvoiceDTO,
    saleInvoiceId,
    trx,
  }: ISaleInvoiceCreatedPayload) => {
    if (saleInvoiceDTO.fromEstimateId) {
      await this.saleEstimatesService.convertEstimateToInvoice(
        tenantId,
        saleInvoiceDTO.fromEstimateId,
        saleInvoiceId,
        trx
      );
    }
  };
}
