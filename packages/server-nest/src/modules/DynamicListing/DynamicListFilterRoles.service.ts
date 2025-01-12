import * as R from 'ramda';
import { Injectable } from '@nestjs/common';
import validator from 'is-my-json-valid';
import { IFilterRole } from './DynamicFilter/DynamicFilter.types';
import { DynamicFilterAdvancedFilter } from './DynamicFilter/DynamicFilterAdvancedFilter';
import { ERRORS } from './constants';
import { ServiceError } from '../Items/ServiceError';
import { BaseModel } from '@/models/Model';
import { DynamicFilterRoleAbstractor } from './DynamicFilter/DynamicFilterRoleAbstractor';

@Injectable()
export class DynamicListFilterRoles extends DynamicFilterRoleAbstractor {
  /**
   * Validates filter roles schema.
   * @param {IFilterRole[]} filterRoles - Filter roles.
   */
  private validateFilterRolesSchema = (filterRoles: IFilterRole[]) => {
    const validate = validator({
      required: ['fieldKey', 'value'],
      type: 'object',
      properties: {
        condition: { type: 'string' },
        fieldKey: { type: 'string' },
        value: { type: 'string' },
      },
    });
    const invalidFields = filterRoles.filter((filterRole) => {
      return !validate(filterRole);
    });
    if (invalidFields.length > 0) {
      throw new ServiceError(ERRORS.STRINGIFIED_FILTER_ROLES_INVALID);
    }
  };

  /**
   * Retrieve filter roles fields key that not exists on the given model.
   * @param {BaseModel} model
   * @param {IFilterRole} filterRoles
   * @returns {string[]}
   */
  private getFilterRolesFieldsNotExist = (
    model: BaseModel,
    filterRoles: IFilterRole[],
  ): string[] => {
    return filterRoles
      .filter((filterRole) => !model.getField(filterRole.fieldKey))
      .map((filterRole) => filterRole.fieldKey);
  };

  /**
   * Validates existance the fields of filter roles.
   * @param {BaseModel} model
   * @param {IFilterRole[]} filterRoles
   * @throws {ServiceError}
   */
  private validateFilterRolesFieldsExistance = (
    model: BaseModel,
    filterRoles: IFilterRole[],
  ) => {
    const invalidFieldsKeys = this.getFilterRolesFieldsNotExist(
      model,
      filterRoles,
    );
    if (invalidFieldsKeys.length > 0) {
      throw new ServiceError(ERRORS.FILTER_ROLES_FIELDS_NOT_FOUND);
    }
  };

  /**
   * Associate index to filter roles.
   * @param {IFilterRole[]} filterRoles
   * @returns {IFilterRole[]}
   */
  private incrementFilterRolesIndex = (
    filterRoles: IFilterRole[],
  ): IFilterRole[] => {
    return filterRoles.map((filterRole, index) => ({
      ...filterRole,
      index: index + 1,
    }));
  };

  /**
   * Dynamic list filter roles.
   * @param {BaseModel} model
   * @param {IFilterRole[]} filterRoles
   * @returns {DynamicFilterFilterRoles}
   */
  public dynamicList = (
    model: BaseModel,
    filterRoles: IFilterRole[],
  ): DynamicFilterAdvancedFilter => {
    const filterRolesParsed = R.compose(this.incrementFilterRolesIndex)(
      filterRoles,
    );
    // Validate filter roles json schema.
    this.validateFilterRolesSchema(filterRolesParsed);

    // Validate the model resource fields.
    this.validateFilterRolesFieldsExistance(model, filterRoles);

    return new DynamicFilterAdvancedFilter(filterRolesParsed);
  };
}
