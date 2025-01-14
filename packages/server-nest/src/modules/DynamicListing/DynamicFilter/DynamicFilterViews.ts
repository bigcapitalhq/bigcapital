import { omit } from 'lodash';
import { DynamicFilterRoleAbstractor } from './DynamicFilterRoleAbstractor';
import { IView } from '@/modules/Views/Views.types';

export class DynamicFilterViews extends DynamicFilterRoleAbstractor {
  private viewSlug: string;
  private logicExpression: string;
  private viewColumns = [];

  /**
   * Constructor method.
   * @param {IView} view -
   */
  constructor(view: IView) {
    super();

    this.viewSlug = view.slug;
    this.filterRoles = view.roles;
    this.viewColumns = view.columns;
    this.logicExpression = view.rolesLogicExpression
      .replace('AND', '&&')
      .replace('OR', '||');

    this.setResponseMeta();
  }

  /**
   * Builds database query of view roles.
   */
  public buildQuery() {
    return (builder) => {
      this.buildFilterQuery(
        this.model,
        this.filterRoles,
        this.logicExpression
      )(builder);
    };
  }

  /**
   * Sets response meta.
   */
  public setResponseMeta() {
    this.responseMeta = {
      view: {
        logicExpression: this.logicExpression,
        filterRoles: this.filterRoles.map((filterRole) => ({
          ...omit(filterRole, ['id', 'viewId']),
        })),
        viewSlug: this.viewSlug,
        viewColumns: this.viewColumns,
      },
    };
  }
}
