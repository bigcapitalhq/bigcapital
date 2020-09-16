import { IFilterRole } from 'interfaces';
import DynamicFilterRoleAbstructor from 'lib/DynamicFilter/DynamicFilterRoleAbstructor';
import {
  validateViewRoles,
  buildFilterQuery,
} from 'lib/ViewRolesBuilder';

export default class DynamicFilterViews extends DynamicFilterRoleAbstructor {
  logicExpression: string;

  /**
   * Constructor method.
   * @param {*} filterRoles - Filter roles.
   * @param {*} logicExpression - Logic expression.
   */
  constructor(filterRoles: IFilterRole[], logicExpression: string) {
    super();

    this.filterRoles = filterRoles;
    this.logicExpression = logicExpression
      .replace('AND', '&&')
      .replace('OR', '||');
  }

  /**
   * Retrieve logic expression.
   */
  buildLogicExpression() {
    return this.logicExpression;
  }

  /**
   * Validates filter roles.
   */
  validate() {
    return validateViewRoles(this.filterRoles, this.logicExpression);
  }

  /**
   * Builds database query of view roles.
   */
  buildQuery() {
    return (builder) => {
      buildFilterQuery(this.tableName, this.filterRoles, this.logicExpression)(builder);
    };
  }
}