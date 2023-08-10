import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { ConvertSaleEstimate } from '@/services/Sales/Estimates/ConvetSaleEstimate';
import { ISaleInvoiceCreatedPayload } from '@/interfaces';
import events from '@/subscribers/events';

@Service()
export default class SaleInvoiceConvertFromEstimateSubscriber extends EventSubscriber {
  @Inject()
  private convertEstimateToInvoiceService: ConvertSaleEstimate;

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
      await this.convertEstimateToInvoiceService.convertEstimateToInvoice(
        tenantId,
        saleInvoiceDTO.fromEstimateId,
        saleInvoiceId,
        trx
      );
    }
  };
}
