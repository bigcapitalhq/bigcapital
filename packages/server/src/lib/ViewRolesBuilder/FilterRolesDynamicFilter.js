import DynamicFilterRoleAbstractor from '@/lib/DynamicFilter/DynamicFilterRoleAbstractor';
import {
  validateViewRoles,
  buildFilterQuery,
} from '@/lib/ViewRolesBuilder';

export default class ViewRolesDynamicFilter extends DynamicFilterRoleAbstractor {
  /**
   * Constructor method.
   * @param {*} filterRoles -
   * @param {*} logicExpression -
   */
  constructor(filterRoles, logicExpression) {
    super();

    this.filterRoles = filterRoles;
    this.logicExpression = logicExpression;

    this.tableName = '';
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
  validateFilterRoles() {
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
