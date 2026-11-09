import { Injectable } from '@nestjs/common';
import {
  CreateTrackingCategoryDto,
  EditTrackingCategoryDto,
} from './dtos/TrackingCategory.dto';
import { CreateTrackingCategoryService } from './commands/CreateTrackingCategory.service';
import { EditTrackingCategoryService } from './commands/EditTrackingCategory.service';
import { DeleteTrackingCategoryService } from './commands/DeleteTrackingCategory.service';
import { GetTrackingCategoriesService } from './queries/GetTrackingCategories.service';
import { GetTrackingCategoryService } from './queries/GetTrackingCategory.service';

@Injectable()
export class TrackingCategoriesApplication {
  constructor(
    private readonly createTrackingCategoryService: CreateTrackingCategoryService,
    private readonly editTrackingCategoryService: EditTrackingCategoryService,
    private readonly deleteTrackingCategoryService: DeleteTrackingCategoryService,
    private readonly getTrackingCategoriesService: GetTrackingCategoriesService,
    private readonly getTrackingCategoryService: GetTrackingCategoryService,
  ) {}

  /**
   * Creates a new tracking category.
   */
  public createTrackingCategory(dto: CreateTrackingCategoryDto) {
    return this.createTrackingCategoryService.createTrackingCategory(dto);
  }

  /**
   * Edits the given tracking category.
   */
  public editTrackingCategory(
    categoryId: number,
    dto: EditTrackingCategoryDto,
  ) {
    return this.editTrackingCategoryService.editTrackingCategory(
      categoryId,
      dto,
    );
  }

  /**
   * Deletes the given tracking category.
   */
  public deleteTrackingCategory(categoryId: number) {
    return this.deleteTrackingCategoryService.deleteTrackingCategory(
      categoryId,
    );
  }

  /**
   * Retrieves all tracking categories.
   */
  public getTrackingCategories() {
    return this.getTrackingCategoriesService.getTrackingCategories();
  }

  /**
   * Retrieves the given tracking category details.
   */
  public getTrackingCategory(categoryId: number) {
    return this.getTrackingCategoryService.getTrackingCategory(categoryId);
  }
}
