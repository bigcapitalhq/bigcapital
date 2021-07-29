import DynamicFilterRoleAbstructor from './DynamicFilterRoleAbstructor';
import { IFilterRole } from 'interfaces';

export default class FilterRoles extends DynamicFilterRoleAbstructor {
  private filterRoles: IFilterRole[];

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
  protected buildQuery() {
    const logicExpression = this.buildLogicExpression();

    return (builder) => {
      this.buildFilterQuery(
        this.model,
        this.filterRoles,
        logicExpression
      )(builder);
    };
  }

  /**
   * Sets response meta.
   */
  private setResponseMeta() {
    this.responseMeta = {
      filterRoles: this.filterRoles,
    };
  }
}
