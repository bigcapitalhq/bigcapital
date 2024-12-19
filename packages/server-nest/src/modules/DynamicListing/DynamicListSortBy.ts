import { Injectable } from '@nestjs/common';
import { DynamicListAbstract } from './DynamicListAbstract';
import { ISortOrder } from './DynamicFilter/DynamicFilter.types';
import { ERRORS } from './constants';
import { DynamicFilterSortBy } from './DynamicFilter';
import { ServiceError } from '../Items/ServiceError';
import { BaseModel } from '@/models/Model';

@Injectable()
export class DynamicListSortBy extends DynamicListAbstract {
  /**
   * Dynamic list sort by.
   * @param {BaseModel} model
   * @param {string} columnSortBy
   * @param {ISortOrder} sortOrder
   * @returns {DynamicFilterSortBy}
   */
  public dynamicSortBy(
    model: BaseModel,
    columnSortBy: string,
    sortOrder: ISortOrder,
  ) {
    this.validateSortColumnExistance(model, columnSortBy);

    return new DynamicFilterSortBy(columnSortBy, sortOrder);
  }

  /**
   * Validates the sort column whether exists.
   * @param {IModel} model - Model.
   * @param {string} columnSortBy - Sort column
   * @throws {ServiceError}
   */
  private validateSortColumnExistance(model: any, columnSortBy: string) {
    const field = model.getField(columnSortBy);

    if (!field) {
      throw new ServiceError(ERRORS.SORT_COLUMN_NOT_FOUND);
    }
  }
}
