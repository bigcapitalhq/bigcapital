import { uniqBy } from 'lodash';
import {
  buildFilterRolesJoins,
} from '@/lib/ViewRolesBuilder';

export default class DynamicFilter {
  /**
   * Constructor.
   * @param {String} tableName -
   */
  constructor(tableName) {
    this.tableName = tableName;
    this.filters = [];
  }

  /**
   * Set filter.
   * @param {*} filterRole -
   */
  setFilter(filterRole) {
    filterRole.setTableName(this.tableName);
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
      tableColumns.push(...(Array.isArray(filterRoles)) ? filterRoles : [filterRoles]);
    });
    return (builder) => {
      buildersCallbacks.forEach((builderCallback) => {
        builderCallback(builder);
      });
      buildFilterRolesJoins(this.tableName, uniqBy(tableColumns, 'columnKey'))(builder);
    };
  }
}