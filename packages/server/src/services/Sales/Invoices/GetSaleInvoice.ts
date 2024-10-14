import { Inject, Service } from 'typedi';
import { ISaleInvoice, ISystemUser } from '@/interfaces';
import { SaleInvoiceTransformer } from './SaleInvoiceTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export class GetSaleInvoice {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private validators: CommandSaleInvoiceValidators;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieve sale invoice with associated entries.
   * @param {Number} saleInvoiceId -
   * @param {ISystemUser} authorizedUser -
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoice(
    tenantId: number,
    saleInvoiceId: number
  ): Promise<ISaleInvoice> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
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
      tenantId,
      saleInvoice,
      new SaleInvoiceTransformer()
    );
    const eventPayload = {
      tenantId,
      saleInvoiceId,
    };
    // Triggers the `onSaleInvoiceItemViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleInvoice.onViewed,
      eventPayload
    );
    return transformed;
  }
}
