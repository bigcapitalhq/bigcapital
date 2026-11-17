import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { SaleInvoice } from '../models/SaleInvoice';
import { SaleInvoiceTransformer } from './SaleInvoice.transformer';
import { CommandSaleInvoiceValidators } from '../commands/CommandSaleInvoiceValidators.service';
import { events } from '@/common/events/events';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '@/modules/Features/FeaturesManager';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SaleInvoiceResponseDto } from '../dtos/SaleInvoiceResponse.dto';

@Injectable()
export class GetSaleInvoice {
  constructor(
    private transformer: TransformerInjectable,
    private validators: CommandSaleInvoiceValidators,
    private eventPublisher: EventEmitter2,
    private featuresManager: FeaturesManager,

    @Inject(SaleInvoice.name)
    private saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Retrieve sale invoice with associated entries.
   * @param {Number} saleInvoiceId -
   * @param {ISystemUser} authorizedUser -
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoice(
    saleInvoiceId: number,
    trx?: Knex.Transaction,
  ): Promise<SaleInvoiceResponseDto> {
    const saleInvoice = await this.saleInvoiceModel()
      .query(trx)
      .findById(saleInvoiceId)
      .withGraphFetched('entries.item')
      .withGraphFetched('entries.batch')
      .withGraphFetched('entries.batches.batch')
      .withGraphFetched('entries.tax')
      .withGraphFetched('customer')
      .withGraphFetched('branch')
      .withGraphFetched('taxes.taxRate')
      .withGraphFetched('attachments')
      .withGraphFetched('paymentMethods');

    // Validates the given sale invoice existance.
    this.validators.validateInvoiceExistance(saleInvoice);

    // Only exposes the batch movements when batch tracking is enabled.
    const isBatchTrackingEnabled = await this.featuresManager.accessible(
      Features.BATCH_TRACKING,
    );
    const transformed = await this.transformer.transform(
      saleInvoice,
      new SaleInvoiceTransformer(),
      { includeBatches: Boolean(isBatchTrackingEnabled) },
    );
    const eventPayload = {
      saleInvoiceId,
    };
    // Triggers the `onSaleInvoiceItemViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleInvoice.onViewed,
      eventPayload,
    );
    return transformed;
  }
}
