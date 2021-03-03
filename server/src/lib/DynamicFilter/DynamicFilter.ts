import { forEach, uniqBy } from 'lodash';
import { buildFilterRolesJoins } from 'lib/ViewRolesBuilder';
import { IModel } from 'interfaces';

export default class DynamicFilter {
  model: IModel;
  tableName: string;

  /**
   * Constructor.
   * @param {String} tableName -
   */
  constructor(model) {
    this.model = model;
    this.tableName = model.tableName;
    this.filters = [];
  }

  /**
   * Set filter.
   * @param {*} filterRole - Filter role.
   */
  setFilter(filterRole) {
    filterRole.setModel(this.model);
    this.filters.push(filterRole);
  }

  /**
   * Builds queries of filter roles.
   */
  buildQuery() {
    const buildersCallbacks = [];
    const tableColumns = [];

    this.filters.forEach((filter) => {
      const { filterRoles } = filter;

      buildersCallbacks.push(filter.buildQuery());
      tableColumns.push(
        ...(Array.isArray(filterRoles) ? filterRoles : [filterRoles])
      );
    });

    return (builder) => {
      buildersCallbacks.forEach((builderCallback) => {
        builderCallback(builder);
      });

      buildFilterRolesJoins(
        this.model,
        uniqBy(tableColumns, 'columnKey')
      )(builder);
    };
  }

  /**
   * Retrieve response metadata from all filters adapters.
   */
  getResponseMeta() {
    const responseMeta = {};

    this.filters.forEach((filter) => {
      const { responseMeta: filterMeta } = filter;

      forEach(filterMeta, (value, key) => {
        responseMeta[key] = value;
      });
    });
    return responseMeta;
  }
}
