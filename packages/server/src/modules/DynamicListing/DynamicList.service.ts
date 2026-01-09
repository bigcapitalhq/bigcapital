import { castArray, isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { IDynamicListFilter } from './DynamicFilter/DynamicFilter.types';
import { DynamicListSortBy } from './DynamicListSortBy.service';
import { DynamicListSearch } from './DynamicListSearch.service';
import { DynamicListCustomView } from './DynamicListCustomView.service';
import { DynamicListFilterRoles } from './DynamicListFilterRoles.service';
import { DynamicFilter } from './DynamicFilter';
import { MetableModel } from './types/DynamicList.types';
import { IFilterMeta } from '@/interfaces/Model';

@Injectable()
export class DynamicListService {
  constructor(
    private dynamicListFilterRoles: DynamicListFilterRoles,
    private dynamicListSearch: DynamicListSearch,
    private dynamicListSortBy: DynamicListSortBy,
    private dynamicListView: DynamicListCustomView,
  ) { }

  /**
   * Parses filter DTO.
   * @param {MetableModel} model - Metable model.
   * @param {IDynamicListFilter} filterDTO - Dynamic list filter DTO.
   */
  private parseFilterObject = (
    model: MetableModel,
    filterDTO: IDynamicListFilter,
  ) => {
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
   * @param {IModel} model - Metable model.
   * @param {IDynamicListFilter} filter - Dynamic filter DTO.
   */
  public dynamicList = async (
    model: MetableModel,
    filter: IDynamicListFilter,
  ) => {
    const dynamicFilter = new DynamicFilter<IFilterMeta>(model);

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
  public parseStringifiedFilter<T extends { stringifiedFilterRoles?: string }>(
    filterRoles: T,
  ): T {
    return {
      ...filterRoles,
      filterRoles: filterRoles.stringifiedFilterRoles
        ? castArray(JSON.parse(filterRoles.stringifiedFilterRoles))
        : [],
    };
  }
}
