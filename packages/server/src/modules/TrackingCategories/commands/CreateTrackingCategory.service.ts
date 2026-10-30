import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TrackingCategory } from '../models/TrackingCategory';
import { CreateTrackingCategoryDto } from '../dtos/TrackingCategory.dto';
import { TrackingCategoryTransformer } from '../queries/TrackingCategoryTransformer';
import { CommandTrackingCategoryValidator } from './CommandTrackingCategoryValidator.service';
import { ERRORS } from '../constants';

@Injectable()
export class CreateTrackingCategoryService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly validator: CommandTrackingCategoryValidator,

    @Inject(TrackingCategory.name)
    private readonly trackingCategoryModel: TenantModelProxy<
      typeof TrackingCategory
    >,
  ) {}

  /**
   * Creates a new tracking category with its options.
   * @param {CreateTrackingCategoryDto} dto
   */
  public createTrackingCategory = async (dto: CreateTrackingCategoryDto) => {
    const name = dto.name.trim();
    const options = (dto.options ?? []).map((option) => ({
      name: option.name.trim(),
      active: option.active ?? true,
    }));

    if (!name) {
      throw new ServiceError(ERRORS.INVALID_TRACKING_CATEGORY_NAME);
    }
    await this.validator.validateNameUnique(name);
    this.validator.validateOptionsUnique(options);

    const category = await this.trackingCategoryModel()
      .query()
      .insertGraphAndFetch({
        name,
        description: dto.description?.trim() || null,
        active: dto.active ?? true,
        options,
      });

    return this.transformer.transform(
      category,
      new TrackingCategoryTransformer(),
    );
  };
}
