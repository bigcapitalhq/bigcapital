import { difference } from 'lodash';
import DynamicFilterRoleAbstructor from 'lib/DynamicFilter/DynamicFilterRoleAbstructor';
import { buildFilterQuery } from 'lib/ViewRolesBuilder';
import { IFilterRole } from 'interfaces';

export default class FilterRoles extends DynamicFilterRoleAbstructor {
  filterRoles: IFilterRole[];

  /**
   * Constructor method.
   * @param {Array} filterRoles -
   * @param {Array} resourceFields -
   */
  constructor(filterRoles: IFilterRole[]) {
    super();
    
    this.filterRoles = filterRoles;
    this.setResponseMeta();
  }

  /**
   * Builds filter roles logic expression.
   * @return {string}
   */
  private buildLogicExpression(): string {
    let expression = '';

    this.filterRoles.forEach((role, index) => {
      expression +=
        index === 0 ? `${role.index} ` : `${role.condition} ${role.index} `;
    });
    return expression.trim();
  }

  /**
   * Builds database query of view roles.
   */
  buildQuery() {
    return (builder) => {
      const logicExpression = this.buildLogicExpression();
      buildFilterQuery(this.model, this.filterRoles, logicExpression)(builder);
    };
  }

  /**
   * Sets response meta.
   */
  setResponseMeta() {
    this.responseMeta = {
      filterRoles: this.filterRoles,
    };
  }
}
