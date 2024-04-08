import { ServiceError } from '@/exceptions';
import { IModel, ISortOrder } from '@/interfaces';
import DynamicFilterSortBy from '@/lib/DynamicFilter/DynamicFilterSortBy';
import { Service } from 'typedi';
import DynamicListAbstract from './DynamicListAbstract';
import { ERRORS } from './constants';

@Service()
export default class DynamicListSortBy extends DynamicListAbstract {
  /**
   * Dynamic list sort by.
   * @param {IModel} model
   * @param {string} columnSortBy
   * @param {ISortOrder} sortOrder
   * @returns {DynamicFilterSortBy}
   */
  public dynamicSortBy(model: IModel, columnSortBy: string, sortOrder: ISortOrder) {
    this.validateSortColumnExistance(model, columnSortBy);

    return new DynamicFilterSortBy(columnSortBy, sortOrder);
  }

  /**
   * Validates the sort column whether exists.
   * @param  {IModel} model - Model.
   * @param  {string} columnSortBy - Sort column
   * @throws {ServiceError}
   */
  private validateSortColumnExistance(model: any, columnSortBy: string) {
    const field = model.getField(columnSortBy);

    if (!field) {
      throw new ServiceError(ERRORS.SORT_COLUMN_NOT_FOUND);
    }
  }
}
