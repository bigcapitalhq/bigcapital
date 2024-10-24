import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { SaleEstimateTransfromer } from './SaleEstimateTransformer';
import { SaleEstimateValidators } from './SaleEstimateValidators';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class GetSaleEstimate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private validators: SaleEstimateValidators;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieve the estimate details with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   */
  public async getEstimate(tenantId: number, estimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const estimate = await SaleEstimate.query()
      .findById(estimateId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('branch')
      .withGraphFetched('attachments');

    // Validates the estimate existance.
    this.validators.validateEstimateExistance(estimate);

    // Transformes sale estimate model to POJO.
    const transformed = await this.transformer.transform(
      tenantId,
      estimate,
      new SaleEstimateTransfromer()
    );
    const eventPayload = { tenantId, saleEstimateId: estimateId };

    // Triggers `onSaleEstimateViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onViewed,
      eventPayload
    );
    return transformed;
  }
}
