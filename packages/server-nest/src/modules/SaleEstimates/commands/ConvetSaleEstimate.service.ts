import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import moment from 'moment';
import { SaleEstimate } from '../models/SaleEstimate';
import { events } from '@/common/events/events';

@Injectable()
export class ConvertSaleEstimate {
  constructor(
    private readonly eventPublisher: EventEmitter2,

    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: typeof SaleEstimate,
  ) {}

  /**
   * Converts estimate to invoice.
   * @param {number} estimateId -
   * @return {Promise<void>}
   */
  public async convertEstimateToInvoice(
    estimateId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Retrieve details of the given sale estimate.
    const saleEstimate = await this.saleEstimateModel.query()
      .findById(estimateId)
      .throwIfNotFound();

    // Marks the estimate as converted from the givne invoice.
    await this.saleEstimateModel.query(trx).where('id', estimateId).patch({
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
