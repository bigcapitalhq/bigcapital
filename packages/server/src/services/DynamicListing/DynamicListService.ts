import { Service, Inject } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { castArray, isEmpty } from 'lodash';
import { ServiceError } from '@/exceptions';
import { DynamicFilter } from '@/lib/DynamicFilter';
import {
  IDynamicListFilter,
  IDynamicListService,
  IFilterRole,
  IModel,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListFilterRoles from './DynamicListFilterRoles';
import DynamicListSortBy from './DynamicListSortBy';
import DynamicListCustomView from './DynamicListCustomView';
import DynamicListSearch from './DynamicListSearch';

@Service()
export default class DynamicListService implements IDynamicListService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListFilterRoles: DynamicListFilterRoles;

  @Inject()
  dynamicListSortBy: DynamicListSortBy;

  @Inject()
  dynamicListView: DynamicListCustomView;

  @Inject()
  dynamicListSearch: DynamicListSearch;

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
    tenantId: number,
    model: IModel,
    filter: IDynamicListFilter
  ) => {
    const dynamicFilter = new DynamicFilter(model);

    // Parses the filter object.
    const parsedFilter = this.parseFilterObject(model, filter);

    // Search by keyword.
    if (filter.searchKeyword) {
      const dynamicListSearch = this.dynamicListSearch.dynamicSearch(
        model,
        filter.searchKeyword
      );
      dynamicFilter.setFilter(dynamicListSearch);
    }
    // Custom view filter roles.
    if (filter.viewSlug) {
      const dynamicListCustomView =
        await this.dynamicListView.dynamicListCustomView(
          dynamicFilter,
          filter.viewSlug,
          tenantId
        );
      dynamicFilter.setFilter(dynamicListCustomView);
    }
    // Sort by the given column.
    if (parsedFilter.columnSortBy) {
      const dynamicListSortBy = this.dynamicListSortBy.dynamicSortBy(
        model,
        parsedFilter.columnSortBy,
        parsedFilter.sortOrder
      );
      dynamicFilter.setFilter(dynamicListSortBy);
    }
    // Filter roles.
    if (!isEmpty(parsedFilter.filterRoles)) {
      const dynamicFilterRoles = this.dynamicListFilterRoles.dynamicList(
        model,
        parsedFilter.filterRoles
      );
      dynamicFilter.setFilter(dynamicFilterRoles);
    }
    return dynamicFilter;
  };

  /**
   * Middleware to catch services errors
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public handlerErrorsToResponse(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'sort_column_not_found') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'SORT.COLUMN.NOT.FOUND',
              message: 'Sort column not found.',
              code: 200,
            },
          ],
        });
      }
      if (error.errorType === 'view_not_found') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'CUSTOM.VIEW.NOT.FOUND',
              message: 'Custom view not found.',
              code: 100,
            },
          ],
        });
      }
      if (error.errorType === 'filter_roles_fields_not_found') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'FILTER.ROLES.FIELDS.NOT.FOUND',
              message: 'Filter roles fields not found.',
              code: 300,
            },
          ],
        });
      }
      if (error.errorType === 'stringified_filter_roles_invalid') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'STRINGIFIED_FILTER_ROLES_INVALID',
              message: 'Stringified filter roles json invalid.',
              code: 400,
            },
          ],
        });
      }
    }
    next(error);
  }

  /**
   * Parses stringified filter roles.
   * @param {string} stringifiedFilterRoles - Stringified filter roles.
   */
  public parseStringifiedFilter = (filterRoles: IDynamicListFilter) => {
    return {
      ...filterRoles,
      filterRoles: filterRoles.stringifiedFilterRoles
        ? castArray(JSON.parse(filterRoles.stringifiedFilterRoles))
        : [],
    };
  };
}
