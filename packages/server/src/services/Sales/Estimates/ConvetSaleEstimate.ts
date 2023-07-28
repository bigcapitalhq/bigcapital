import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import moment from 'moment';
import { Inject, Service } from 'typedi';

@Service()
export class ConvertSaleEstimate {
  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Converts estimate to invoice.
   * @param {number} tenantId -
   * @param {number} estimateId -
   * @return {Promise<void>}
   */
  async convertEstimateToInvoice(
    tenantId: number,
    estimateId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate.
    const saleEstimate = await this.getSaleEstimateOrThrowError(
      tenantId,
      estimateId
    );
    // Marks the estimate as converted from the givne invoice.
    await SaleEstimate.query(trx).where('id', estimateId).patch({
      convertedToInvoiceId: invoiceId,
      convertedToInvoiceAt: moment().toMySqlDateTime(),
    });
    // Triggers `onSaleEstimateConvertedToInvoice` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onConvertedToInvoice,
      {}
    );
  }
}
