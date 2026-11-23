import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TrackingCategory } from '../models/TrackingCategory';
import { TrackingCategoryTransformer } from './TrackingCategoryTransformer';

@Injectable()
export class GetTrackingCategoriesService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(TrackingCategory.name)
    private readonly trackingCategoryModel: TenantModelProxy<
      typeof TrackingCategory
    >,
  ) {}

  /**
   * Retrieves all tracking categories with their options.
   */
  public getTrackingCategories = async () => {
    const categories = await this.trackingCategoryModel()
      .query()
      .withGraphFetched('options')
      .orderBy('name', 'asc');

    return this.transformer.transform(
      categories,
      new TrackingCategoryTransformer(),
    );
  };
}
