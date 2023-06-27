import DynamicFilterRoleAbstractor from './DynamicFilterRoleAbstractor';
import { IFilterRole } from '@/interfaces';

export default class FilterRoles extends DynamicFilterRoleAbstractor {
  private filterRoles: IFilterRole[];

  /**
   * On initialize filter roles.
   */
  public onInitialize() {
    super.onInitialize();
    this.setFilterRolesRelations();
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
   * Sets filter roles relations if field was relation type.
   */
  private setFilterRolesRelations() {
    this.filterRoles.forEach((relationRole) => {
      this.setRelationIfRelationField(relationRole.fieldKey);
    });
  }
}
