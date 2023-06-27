import { Service } from 'typedi';
import * as R from 'ramda';
import validator from 'is-my-json-valid';
import { IFilterRole, IModel } from '@/interfaces';
import DynamicListAbstract from './DynamicListAbstract';
import DynamicFilterAdvancedFilter from '@/lib/DynamicFilter/DynamicFilterAdvancedFilter';
import { ERRORS } from './constants';
import { ServiceError } from '@/exceptions';

@Service()
export default class DynamicListFilterRoles extends DynamicListAbstract {
  /**
   * Validates filter roles schema.
   * @param {IFilterRole[]} filterRoles - Filter roles.
   */
  private validateFilterRolesSchema = (filterRoles: IFilterRole[]) => {
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
      return !validate(filterRole);
    });
    if (invalidFields.length > 0) {
      throw new ServiceError(ERRORS.STRINGIFIED_FILTER_ROLES_INVALID);
    }
  };

  /**
   * Retrieve filter roles fields key that not exists on the given model.
   * @param {IModel} model
   * @param {IFilterRole} filterRoles
   * @returns {string[]}
   */
  private getFilterRolesFieldsNotExist = (
    model,
    filterRoles: IFilterRole[]
  ): string[] => {
    return filterRoles
      .filter((filterRole) => !model.getField(filterRole.fieldKey))
      .map((filterRole) => filterRole.fieldKey);
  };

  /**
   * Validates existence the fields of filter roles.
   * @param  {IModel} model
   * @param  {IFilterRole[]} filterRoles
   * @throws {ServiceError}
   */
  private validateFilterRolesFieldsExistence = (
    model: IModel,
    filterRoles: IFilterRole[]
  ) => {
    const invalidFieldsKeys = this.getFilterRolesFieldsNotExist(
      model,
      filterRoles
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
    filterRoles: IFilterRole[]
  ): IFilterRole[] => {
    return filterRoles.map((filterRole, index) => ({
      ...filterRole,
      index: index + 1,
    }));
  };

  /**
   * Dynamic list filter roles.
   * @param {IModel} model
   * @param {IFilterRole[]} filterRoles
   * @returns {DynamicFilterFilterRoles}
   */
  public dynamicList = (
    model: IModel,
    filterRoles: IFilterRole[]
  ): DynamicFilterAdvancedFilter => {
    const filterRolesParsed = R.compose(this.incrementFilterRolesIndex)(
      filterRoles
    );
    // Validate filter roles json schema.
    this.validateFilterRolesSchema(filterRolesParsed);

    // Validate the model resource fields.
    this.validateFilterRolesFieldsExistence(model, filterRoles);

    return new DynamicFilterAdvancedFilter(filterRolesParsed);
  };
}
