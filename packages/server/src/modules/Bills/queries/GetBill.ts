import { Inject, Injectable } from '@nestjs/common';
import { BillsValidators } from '../commands/BillsValidators.service';
import { BillTransformer } from './Bill.transformer';
import { Bill } from '../models/Bill';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '@/modules/Features/FeaturesManager';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BillResponseDto } from '../dtos/BillResponse.dto';

@Injectable()
export class GetBill {
  constructor(
    @Inject(Bill.name) private billModel: TenantModelProxy<typeof Bill>,

    private transformer: TransformerInjectable,
    private validators: BillsValidators,
    private featuresManager: FeaturesManager,
  ) {}

  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId - Specific bill.
   * @returns {Promise<BillResponseDto>}
   */
  public async getBill(billId: number): Promise<BillResponseDto> {
    const bill = await this.billModel()
      .query()
      .findById(billId)
      .withGraphFetched('vendor')
      .withGraphFetched('entries.item')
      .withGraphFetched('entries.batch')
      .withGraphFetched('entries.batches.batch')
      .withGraphFetched('branch')
      .withGraphFetched('taxes.taxRate')
      .withGraphFetched('attachments');

    // Validates the bill existence.
    this.validators.validateBillExistance(bill);

    // Only exposes the batch movements when batch tracking is enabled.
    const isBatchTrackingEnabled = await this.featuresManager.accessible(
      Features.BATCH_TRACKING,
    );
    return this.transformer.transform(bill, new BillTransformer(), {
      includeBatches: Boolean(isBatchTrackingEnabled),
    });
  }
}
