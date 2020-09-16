import { Service, Inject } from "typedi";
import validator from 'is-my-json-valid';
import { Router, Request, Response, NextFunction } from 'express';
import { ServiceError } from 'exceptions';
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterViews,
  DynamicFilterFilterRoles,
} from 'lib/DynamicFilter';
import {
  validateFieldKeyExistance,
  validateFilterRolesFieldsExistance,
} from 'lib/ViewRolesBuilder';

import TenancyService from 'services/Tenancy/TenancyService';
import { IDynamicListFilterDTO, IFilterRole, IDynamicListService } from 'interfaces';

const ERRORS = {
  VIEW_NOT_FOUND: 'view_not_found',
  SORT_COLUMN_NOT_FOUND: 'sort_column_not_found',
  FILTER_ROLES_FIELDS_NOT_FOUND: 'filter_roles_fields_not_found',
};

@Service()
export default class DynamicListService implements IDynamicListService {
  @Inject()
  tenancy: TenancyService;

  /**
   * Retreive custom view or throws error not found.
   * @param  {number} tenantId 
   * @param  {number} viewId 
   * @return {Promise<IView>}
   */
  private async getCustomViewOrThrowError(tenantId: number, viewId: number) {
    const { viewRepository } = this.tenancy.repositories(tenantId);
    const view = await viewRepository.getById(viewId);

    if (!view || view.resourceModel !== 'Account') {
      throw new ServiceError(ERRORS.VIEW_NOT_FOUND);
    }
    return view;
  }

  /**
   * Validates the sort column whether exists.
   * @param  {IModel} model 
   * @param  {string} columnSortBy - Sort column
   * @throws {ServiceError}
   */
  private validateSortColumnExistance(model: any, columnSortBy: string) {
    const notExistsField = validateFieldKeyExistance(model.tableName, columnSortBy);

    if (notExistsField) {
      throw new ServiceError(ERRORS.SORT_COLUMN_NOT_FOUND);
    }
  }

  /**
   * Validates existance the fields of filter roles.
   * @param  {IModel} model 
   * @param  {IFilterRole[]} filterRoles 
   * @throws {ServiceError}
   */
  private validateRolesFieldsExistance(model: any, filterRoles: IFilterRole[]) {
    const invalidFieldsKeys = validateFilterRolesFieldsExistance(model.tableName, filterRoles);

    if (invalidFieldsKeys.length > 0) {
      throw new ServiceError(ERRORS.FILTER_ROLES_FIELDS_NOT_FOUND);
    }
  }

  /**
   * Validates filter roles schema.
   * @param {IFilterRole[]} filterRoles 
   */
  private validateFilterRolesSchema(filterRoles: IFilterRole[]) {
    const validate = validator({
      required: true,
      type: 'object',
      properties: {
        fieldKey: { required: true, type: 'string' },
        value: { required: true, type: 'string' },
      },
    });
    const invalidFields = filterRoles.filter((filterRole) => {
      const isValid = validate(filterRole);
      return isValid ? false : true;
    });
    if (invalidFields.length > 0) {
      throw new ServiceError('stringified_filter_roles_invalid');
    }
  }

  /**
   * Dynamic listing.
   * @param {number} tenantId 
   * @param {IModel} model 
   * @param {IAccountsFilter} filter 
   */
  async dynamicList(tenantId: number, model: any, filter: IDynamicListFilterDTO) {
    const { viewRoleRepository } = this.tenancy.repositories(tenantId);
    const dynamicFilter = new DynamicFilter(model.tableName);

    // Custom view filter roles.
    if (filter.customViewId) {
      const view = await this.getCustomViewOrThrowError(tenantId, filter.customViewId);
      const viewRoles = await viewRoleRepository.allByView(view.id);

      const viewFilter = new DynamicFilterViews(viewRoles, view.rolesLogicExpression);
      dynamicFilter.setFilter(viewFilter);
    }
    // Sort by the given column.
    if (filter.columnSortBy) {
      this.validateSortColumnExistance(model, filter.columnSortBy);;

      const sortByFilter = new DynamicFilterSortBy(
        filter.columnSortBy, filter.sortOrder
      );
      dynamicFilter.setFilter(sortByFilter);
    }
    // Filter roles.
    if (filter.filterRoles.length > 0) {
      this.validateFilterRolesSchema(filter.filterRoles);
      this.validateRolesFieldsExistance(model, filter.filterRoles);

      // Validate the accounts resource fields.
      const filterRoles = new DynamicFilterFilterRoles(filter.filterRoles);
      dynamicFilter.setFilter(filterRoles);
    }
    return dynamicFilter;
  }

  /**
   * Middleware to catch services errors
   * @param {Error} error 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  handlerErrorsToResponse(error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'sort_column_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SORT.COLUMN.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'view_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOM.VIEW.NOT.FOUND', code: 100 }]
        })
      }
      if (error.errorType === 'filter_roles_fields_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'FILTER.ROLES.FIELDS.NOT.FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'stringified_filter_roles_invalid') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'STRINGIFIED_FILTER_ROLES_INVALID', code: 400 }],
        });
      }
    }
    next(error);
  }
}