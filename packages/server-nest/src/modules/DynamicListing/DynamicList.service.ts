import { castArray, isEmpty } from 'lodash';
import { IDynamicListFilter } from './DynamicFilter/DynamicFilter.types';
import { DynamicListSortBy } from './DynamicListSortBy.service';
import { DynamicListSearch } from './DynamicListSearch.service';
import { DynamicListCustomView } from './DynamicListCustomView.service';
import { Injectable } from '@nestjs/common';
import { DynamicListFilterRoles } from './DynamicListFilterRoles.service';
import { DynamicFilter } from './DynamicFilter';
import { BaseModel } from '@/models/Model';

@Injectable()
export class DynamicListService {
  constructor(
    private dynamicListFilterRoles: DynamicListFilterRoles,
    private dynamicListSearch: DynamicListSearch,
    private dynamicListSortBy: DynamicListSortBy,
    private dynamicListView: DynamicListCustomView,
  ) {}

  /**
   * Parses filter DTO.
   * @param {IMode} model -
   * @param {} filterDTO -
   */
  private parseFilterObject = (model, filterDTO) => {
    return {
      // Merges the default properties with filter object.
      ...(model.defaultSort
        ? {
            sortOrder: model.defaultSort.sortOrder,
            columnSortBy: model.defaultSort.sortOrder,
          }
        : {}),
      ...filterDTO,
    };
  };

  /**
   * Dynamic listing.
   * @param {number} tenantId - Tenant id.
   * @param {IModel} model - Model.
   * @param {IDynamicListFilter} filter - Dynamic filter DTO.
   */
  public dynamicList = async (
    model: typeof BaseModel,
    filter: IDynamicListFilter,
  ) => {
    const dynamicFilter = new DynamicFilter(model);

    // Parses the filter object.
    const parsedFilter = this.parseFilterObject(model, filter);

    // Search by keyword.
    if (filter.searchKeyword) {
      const dynamicListSearch = this.dynamicListSearch.dynamicSearch(
        filter.searchKeyword,
      );
      dynamicFilter.setFilter(dynamicListSearch);
    }
    // Custom view filter roles.
    if (filter.viewSlug) {
      const dynamicListCustomView =
        await this.dynamicListView.dynamicListCustomView(
          dynamicFilter,
          filter.viewSlug,
        );
      dynamicFilter.setFilter(dynamicListCustomView);
    }
    // Sort by the given column.
    if (parsedFilter.columnSortBy) {
      const dynmaicListSortBy = this.dynamicListSortBy.dynamicSortBy(
        model,
        parsedFilter.columnSortBy,
        parsedFilter.sortOrder,
      );
      dynamicFilter.setFilter(dynmaicListSortBy);
    }
    // Filter roles.
    if (!isEmpty(parsedFilter.filterRoles)) {
      const dynamicFilterRoles = this.dynamicListFilterRoles.dynamicList(
        model,
        parsedFilter.filterRoles,
      );
      dynamicFilter.setFilter(dynamicFilterRoles);
    }
    return dynamicFilter;
  };

  /**
   * Parses stringified filter roles.
   * @param {string} stringifiedFilterRoles - Stringified filter roles.
   */
  public parseStringifiedFilter<T extends IDynamicListFilter>(
    filterRoles: T,
  ): T {
    return {
      ...filterRoles,
      filterRoles: filterRoles.stringifiedFilterRoles
        ? castArray(JSON.parse(filterRoles.stringifiedFilterRoles))
        : [],
    };
  };
}
