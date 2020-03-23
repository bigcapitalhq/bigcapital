import { difference } from 'lodash';
import {
  buildFilterQuery,
} from '../ViewRolesBuilder';

export default class FilterRoles {
  /**
   * Constructor method.
   * @param {Array} filterRoles -
   * @param {Array} resourceFields -
   */
  constructor(tableName, filterRoles, resourceFields) {
    this.filterRoles = filterRoles.map((role, index) => ({
      ...role,
      index: index + 1,
      columnKey: role.field_key,
    }));
    this.resourceFields = resourceFields;
    this.tableName = tableName;
  }

  validateFilterRoles() {
    const filterFieldsKeys = this.filterRoles.map((r) => r.field_key);
    const resourceFieldsKeys = this.resourceFields.map((r) => r.key);

    return difference(filterFieldsKeys, resourceFieldsKeys);
  }

  // @private
  buildLogicExpression() {
    let expression = '';
    this.filterRoles.forEach((role, index) => {
      expression += (index === 0)
        ? `${role.index} ` : `${role.condition} ${role.index} `;
    });
    return expression.trim();
  }

  // @public
  buildQuery() {
    const logicExpression = this.buildLogicExpression();
    return (builder) => {
      buildFilterQuery(this.tableName, this.filterRoles, logicExpression)(builder);
    };
  }
}