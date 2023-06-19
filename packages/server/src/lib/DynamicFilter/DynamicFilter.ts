import { forEach, uniqBy } from 'lodash';
import DynamicFilterAbstractor from './DynamicFilterAbstractor';
import { IDynamicFilter, IFilterRole, IModel } from '@/interfaces';

export default class DynamicFilter extends DynamicFilterAbstractor{
  private model: IModel;
  private tableName: string;
  private dynamicFilters: IDynamicFilter[];

  /**
   * Constructor.
   * @param {String} tableName -
   */
  constructor(model) {
    super();

    this.model = model;
    this.tableName = model.tableName;
    this.dynamicFilters = [];
  }

  /**
   * Registers the given dynamic filter.
   * @param {IDynamicFilter} filterRole - Filter role.
   */
  public setFilter = (dynamicFilter: IDynamicFilter) => {
    dynamicFilter.setModel(this.model);

    dynamicFilter.onInitialize();

    this.dynamicFilters.push(dynamicFilter);
  }

  /**
   * Retrieve dynamic filter build queries.
   * @returns 
   */
  private dynamicFiltersBuildQuery = () => {
    return this.dynamicFilters.map((filter) => {
      return filter.buildQuery()
    });
  }

  /**
   * Retrieve dynamic filter roles.
   * @returns {IFilterRole[]}
   */
  private dynamicFilterTableColumns = (): IFilterRole[] => {
    const localFilterRoles = [];

    this.dynamicFilters.forEach((dynamicFilter) => {
      const { filterRoles } = dynamicFilter;

      localFilterRoles.push(
        ...(Array.isArray(filterRoles) ? filterRoles : [filterRoles])
      );
    });
    return localFilterRoles;
  }

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
  }

  /**
   * Retrieve response metadata from all filters adapters.
   */
  public getResponseMeta = () => {
    const responseMeta = {};

    this.dynamicFilters.forEach((filter) => {
      const { responseMeta: filterMeta } = filter;

      forEach(filterMeta, (value, key) => {
        responseMeta[key] = value;
      });
    });
    return responseMeta;
  }
}
