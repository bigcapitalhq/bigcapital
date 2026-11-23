import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TrackingCategory } from '../models/TrackingCategory';
import { EditTrackingCategoryDto } from '../dtos/TrackingCategory.dto';
import { TrackingCategoryTransformer } from '../queries/TrackingCategoryTransformer';
import { CommandTrackingCategoryValidator } from './CommandTrackingCategoryValidator.service';
import { ERRORS } from '../constants';
import { normalizeTrackingCategoryModules } from '../utils';

@Injectable()
export class EditTrackingCategoryService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly validator: CommandTrackingCategoryValidator,

    @Inject(TrackingCategory.name)
    private readonly trackingCategoryModel: TenantModelProxy<
      typeof TrackingCategory
    >,
  ) {}

  /**
   * Edits the given tracking category.
   * @param {number} categoryId - Tracking category id.
   * @param {EditTrackingCategoryDto} dto
   */
  public editTrackingCategory = async (
    categoryId: number,
    dto: EditTrackingCategoryDto,
  ) => {
    const oldCategory = await this.trackingCategoryModel()
      .query()
      .findById(categoryId)
      .withGraphFetched('options')
      .throwIfNotFound();

    let options: Array<{
      id?: number;
      name: string;
      active: boolean;
    }> | null = null;

    if (dto.name !== undefined) {
      const name = dto.name.trim();

      if (!name) {
        throw new ServiceError(ERRORS.INVALID_TRACKING_CATEGORY_NAME);
      }
      await this.validator.validateNameUnique(name, categoryId);
    }

    if (dto.options !== undefined) {
      options = dto.options.map((option) => ({
        ...(option.id ? { id: option.id } : {}),
        name: option.name.trim(),
        active: option.active ?? true,
      }));
      this.validator.validateOptionsUnique(options);

      const optionIds = options
        .filter((option) => option.id)
        .map((option) => option.id as number);

      await this.validator.validateOptionIdsBelongToCategory(
        categoryId,
        optionIds,
      );

      const incomingOptionIds = new Set(optionIds);
      const removedOptionIds = (oldCategory.options ?? [])
        .filter((option) => !incomingOptionIds.has(option.id))
        .map((option) => option.id);

      await this.validator.validateOptionsNotInUse(removedOptionIds);
    }

    const updatedCategory = await this.trackingCategoryModel()
      .query()
      .upsertGraphAndFetch({
        id: categoryId,
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description?.trim() || null }
          : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
        ...(dto.modules !== undefined
          ? { modules: normalizeTrackingCategoryModules(dto.modules) }
          : {}),
        ...(options !== null ? { options } : {}),
      });

    return this.transformer.transform(
      updatedCategory,
      new TrackingCategoryTransformer(),
    );
  };
}
