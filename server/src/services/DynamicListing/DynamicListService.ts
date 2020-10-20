import { Service, Inject } from "typedi";
import validator from 'is-my-json-valid';
import { Request, Response, NextFunction } from 'express';
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
import {
  IDynamicListFilterDTO,
  IFilterRole,
  IDynamicListService,
  IModel,
} from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';

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
  private async getCustomViewOrThrowError(tenantId: number, viewId: number, model: IModel) {
    const { viewRepository } = this.tenancy.repositories(tenantId);
    const view = await viewRepository.getById(viewId);

    if (!view || view.resourceModel !== model.name) {
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
    const notExistsField = validateFieldKeyExistance(model, columnSortBy);

    if (!notExistsField) {
      throw new ServiceError(ERRORS.SORT_COLUMN_NOT_FOUND);
    }
  }

  /**
   * Validates existance the fields of filter roles.
   * @param  {IModel} model 
   * @param  {IFilterRole[]} filterRoles 
   * @throws {ServiceError}
   */
  private validateRolesFieldsExistance(model: IModel, filterRoles: IFilterRole[]) {
    const invalidFieldsKeys = validateFilterRolesFieldsExistance(model, filterRoles);

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
        condition: { type: 'string' },
        fieldKey: { required: true, type: 'string' },
        value: { required: true },
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
   * @param {IDynamicListFilterDTO} filter 
   */
  public async dynamicList(tenantId: number, model: IModel, filter: IDynamicListFilterDTO) {
    const dynamicFilter = new DynamicFilter(model);

    // Custom view filter roles.
    if (filter.customViewId) {
      const view = await this.getCustomViewOrThrowError(tenantId, filter.customViewId, model);

      const viewFilter = new DynamicFilterViews(view);
      dynamicFilter.setFilter(viewFilter);
    }
    // Sort by the given column.
    if (filter.columnSortBy) {
      this.validateSortColumnExistance(model, filter.columnSortBy);

      const sortByFilter = new DynamicFilterSortBy(
        filter.columnSortBy, filter.sortOrder
      );
      dynamicFilter.setFilter(sortByFilter);
    }
    // Filter roles.
    if (filter.filterRoles.length > 0) {
      const filterRoles = filter.filterRoles.map((filterRole, index) => ({
        ...filterRole,
        index: index + 1,
      }));
      this.validateFilterRolesSchema(filterRoles);
      this.validateRolesFieldsExistance(model, filterRoles);

      // Validate the model resource fields.
      const dynamicFilterRoles = new DynamicFilterFilterRoles(filterRoles);
      dynamicFilter.setFilter(dynamicFilterRoles);
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
  public handlerErrorsToResponse(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'sort_column_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SORT.COLUMN.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'view_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOM.VIEW.NOT.FOUND', code: 100 }],
        });
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