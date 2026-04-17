import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { SaleEstimateTransfromer } from './SaleEstimate.transformer';
import { SaleEstimateValidators } from '../commands/SaleEstimateValidators.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { SaleEstimate } from '../models/SaleEstimate';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetResourceCustomFieldsService } from '@/modules/CustomFields/queries/GetResourceCustomFields.service';

@Injectable()
export class GetSaleEstimate {
  constructor(
    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,

    private readonly transformer: TransformerInjectable,
    private readonly validators: SaleEstimateValidators,
    private readonly eventPublisher: EventEmitter2,
    private readonly getResourceCustomFieldsService: GetResourceCustomFieldsService,
  ) {}

  /**
   * Retrieve the estimate details with associated entries.
   * @async
   * @param {Integer} estimateId
   */
  public async getEstimate(estimateId: number) {
    const estimate = await this.saleEstimateModel()
      .query()
      .findById(estimateId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('branch')
      .withGraphFetched('attachments');

    // Validates the estimate existance.
    this.validators.validateEstimateExistance(estimate);

    // Load custom field values.
    const customFields = await this.getResourceCustomFieldsService.getResourceCustomFields(
      'SaleEstimate',
      estimateId,
    );

    // Transformes sale estimate model to POJO.
    const transformed = await this.transformer.transform(
      estimate,
      new SaleEstimateTransfromer(),
      { customFields },
    );

    const eventPayload = { saleEstimateId: estimateId };

    // Triggers `onSaleEstimateViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onViewed,
      eventPayload,
    );
    return transformed;
  }
}
