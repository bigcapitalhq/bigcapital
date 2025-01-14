import { forEach } from 'lodash';
import { DynamicFilterAbstractor } from './DynamicFilterAbstractor';
import { IFilterRole } from './DynamicFilter.types';
import { DynamicFilterRoleAbstractor } from './DynamicFilterRoleAbstractor';
import { MetableModel } from '../types/DynamicList.types';

export class DynamicFilter<R extends {}> extends DynamicFilterAbstractor {
  public model: MetableModel;
  public dynamicFilters: DynamicFilterRoleAbstractor[];

  /**
   * Constructor.
   * @param {MetableModel} model - Metable model.
   */
  constructor(model: MetableModel) {
    super();

    this.model = model;
    this.dynamicFilters = [];
  }

  /**
   * Registers the given dynamic filter.
   * @param {IDynamicFilter} filterRole - Filter role.
   */
  public setFilter = (dynamicFilter: DynamicFilterRoleAbstractor) => {
    dynamicFilter.setModel(this.model);
    dynamicFilter.onInitialize();

    this.dynamicFilters.push(dynamicFilter);
  };

  /**
   * Retrieve dynamic filter build queries.
   * @returns {Function[]}
   */
  private dynamicFiltersBuildQuery = () => {
    return this.dynamicFilters.map((filter) => {
      return filter.buildQuery();
    });
  };

  /**
   * Retrieve dynamic filter roles.
   * @returns {IFilterRole[]}
   */
  private dynamicFilterTableColumns = (): IFilterRole[] => {
    const localFilterRoles = [];

    this.dynamicFilters.forEach((dynamicFilter) => {
      const { filterRoles } = dynamicFilter;

      localFilterRoles.push(
        ...(Array.isArray(filterRoles) ? filterRoles : [filterRoles]),
      );
    });
    return localFilterRoles;
  };

  /**
   * Builds queries of filter roles.
   */
  public buildQuery = () => {
    const buildersCallbacks = this.dynamicFiltersBuildQuery();
    const tableColumns = this.dynamicFilterTableColumns();

    return (builder) => {
      buildersCallbacks.forEach((builderCallback) => {
        builderCallback(builder);
      });
      this.buildFilterRolesJoins(builder);
    };
  };

  /**
   * Retrieve response metadata from all filters adapters.
   */
  public getResponseMeta = (): R => {
    const responseMeta = {};

    this.dynamicFilters.forEach((filter) => {
      const filterMeta = filter.getResponseMeta();

      forEach(filterMeta, (value, key) => {
        responseMeta[key] = value;
      });
    });
    return responseMeta as R;
  };
}
