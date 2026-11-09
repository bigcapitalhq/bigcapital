import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TrackingCategory } from '../models/TrackingCategory';
import { TrackingCategoryTransformer } from './TrackingCategoryTransformer';

@Injectable()
export class GetTrackingCategoryService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(TrackingCategory.name)
    private readonly trackingCategoryModel: TenantModelProxy<
      typeof TrackingCategory
    >,
  ) {}

  /**
   * Retrieves the given tracking category with its options.
   * @param {number} categoryId - Tracking category id.
   */
  public getTrackingCategory = async (categoryId: number) => {
    const category = await this.trackingCategoryModel()
      .query()
      .findById(categoryId)
      .withGraphFetched('options')
      .throwIfNotFound();

    return this.transformer.transform(
      category,
      new TrackingCategoryTransformer(),
    );
  };
}
