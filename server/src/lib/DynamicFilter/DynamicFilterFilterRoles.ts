import { difference } from 'lodash';
import DynamicFilterRoleAbstructor from 'lib/DynamicFilter/DynamicFilterRoleAbstructor';
import {
  buildFilterQuery,
} from 'lib/ViewRolesBuilder';
import { IFilterRole } from 'interfaces';

export default class FilterRoles extends DynamicFilterRoleAbstructor {
  /**
   * Constructor method.
   * @param {Array} filterRoles -
   * @param {Array} resourceFields -
   */
  constructor(filterRoles: IFilterRole[]) {
    super();
    this.filterRoles = filterRoles;
  }

  private buildLogicExpression(): string {
    let expression = '';
    this.filterRoles.forEach((role, index) => {
      expression += (index === 0) ?
        `${role.index} ` :
        `${role.condition} ${role.index} `;
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