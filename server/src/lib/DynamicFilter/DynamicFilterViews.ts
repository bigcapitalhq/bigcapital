import { omit } from 'lodash';
import { IView, IViewRole } from 'interfaces';
import DynamicFilterRoleAbstructor from 'lib/DynamicFilter/DynamicFilterRoleAbstructor';
import {
  buildFilterQuery,
} from 'lib/ViewRolesBuilder';

export default class DynamicFilterViews extends DynamicFilterRoleAbstructor {
  viewId: number;
  logicExpression: string;
  filterRoles: IViewRole[];

  /**
   * Constructor method.
   * @param {IView} view - 
   */
  constructor(view: IView) {
    super();

    this.viewId = view.id;
    this.filterRoles = view.roles;
    this.logicExpression = view.rolesLogicExpression
      .replace('AND', '&&')
      .replace('OR', '||');

    this.setResponseMeta();  
  }

  /**
   * Retrieve logic expression.
   */
  buildLogicExpression() {
    return this.logicExpression;
  }
 
  /**
   * Builds database query of view roles.
   */
  buildQuery() {
    return (builder) => {
      buildFilterQuery(this.model, this.filterRoles, this.logicExpression)(builder);
    };
  }

  /**
   * Sets response meta.
   */
  setResponseMeta() {
    this.responseMeta = {
      view: {
        logicExpression: this.logicExpression,
        filterRoles: this.filterRoles.map((filterRole) =>
          ({ ...omit(filterRole, ['id', 'viewId']) })
        ),
        customViewId: this.viewId,
      }
    };
  }
}