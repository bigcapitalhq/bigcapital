import { difference } from 'lodash';
import DynamicFilterRoleAbstructor from 'lib/DynamicFilter/DynamicFilterRoleAbstructor';
import {
  buildFilterQuery,
} from 'lib/ViewRolesBuilder';

export default class FilterRoles extends DynamicFilterRoleAbstructor {
  /**
   * Constructor method.
   * @param {Array} filterRoles -
   * @param {Array} resourceFields -
   */
  constructor(filterRoles, resourceFields) {
    super();

    this.filterRoles = filterRoles.map((role, index) => ({
      ...role,
      index: index + 1,
      columnKey: role.field_key,
      condition: role.comparator === 'AND' ? '&&' : '||',
    }));
    this.resourceFields = resourceFields;
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

  /**
   * Builds database query of view roles.
   */
  buildQuery() {
    return (builder) => {
      const logicExpression = this.buildLogicExpression();
      buildFilterQuery(this.tableName, this.filterRoles, logicExpression)(builder);
    };
  }
}