import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import moment from 'moment';
import { Inject, Service } from 'typedi';

@Service()
export class ConvertSaleEstimate {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Converts estimate to invoice.
   * @param {number} tenantId -
   * @param {number} estimateId -
   * @return {Promise<void>}
   */
  public async convertEstimateToInvoice(
    tenantId: number,
    estimateId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate.
    const saleEstimate = await SaleEstimate.query()
      .findById(estimateId)
      .throwIfNotFound();

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
