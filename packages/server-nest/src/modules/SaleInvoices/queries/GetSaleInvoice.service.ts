import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { SaleInvoice } from '../models/SaleInvoice';
import { SaleInvoiceTransformer } from './SaleInvoice.transformer';
import { CommandSaleInvoiceValidators } from '../commands/CommandSaleInvoiceValidators.service';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetSaleInvoice {
  constructor(
    private transformer: TransformerInjectable,
    private validators: CommandSaleInvoiceValidators,
    private eventPublisher: EventEmitter2,

    @Inject(SaleInvoice.name)
    private saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Retrieve sale invoice with associated entries.
   * @param {Number} saleInvoiceId -
   * @param {ISystemUser} authorizedUser -
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoice(saleInvoiceId: number): Promise<SaleInvoice> {
    const saleInvoice = await this.saleInvoiceModel()
      .query()
      .findById(saleInvoiceId)
      .withGraphFetched('entries.item')
      .withGraphFetched('entries.tax')
      .withGraphFetched('customer')
      .withGraphFetched('branch')
      .withGraphFetched('taxes.taxRate')
      .withGraphFetched('attachments')
      .withGraphFetched('paymentMethods');

    // Validates the given sale invoice existance.
    this.validators.validateInvoiceExistance(saleInvoice);

    const transformed = await this.transformer.transform(
      saleInvoice,
      new SaleInvoiceTransformer(),
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
