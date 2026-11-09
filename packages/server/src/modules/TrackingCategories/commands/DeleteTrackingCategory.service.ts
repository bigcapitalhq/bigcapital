import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TrackingCategory } from '../models/TrackingCategory';
import { CommandTrackingCategoryValidator } from './CommandTrackingCategoryValidator.service';

@Injectable()
export class DeleteTrackingCategoryService {
  constructor(
    private readonly validator: CommandTrackingCategoryValidator,

    @Inject(TrackingCategory.name)
    private readonly trackingCategoryModel: TenantModelProxy<
      typeof TrackingCategory
    >,
  ) {}

  /**
   * Deletes the given tracking category when it is not in use.
   * @param {number} categoryId - Tracking category id.
   */
  public deleteTrackingCategory = async (categoryId: number): Promise<void> => {
    await this.trackingCategoryModel()
      .query()
      .findById(categoryId)
      .throwIfNotFound();

    await this.validator.validateCategoryNotInUse(categoryId);
    await this.trackingCategoryModel().query().deleteById(categoryId);
  };
}
