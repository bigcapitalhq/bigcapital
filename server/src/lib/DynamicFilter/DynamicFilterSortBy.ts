import DynamicFilterRoleAbstructor from 'lib/DynamicFilter/DynamicFilterRoleAbstructor';
import { getRoleFieldColumn, validateFieldKeyExistance } from 'lib/ViewRolesBuilder';

export default class DynamicFilterSortBy extends DynamicFilterRoleAbstructor {
  sortRole: { fieldKey: string, order: string } = {};

  /**
   * Constructor method.
   * @param {string} sortByFieldKey
   * @param {string} sortDirection
   */
  constructor(sortByFieldKey: string, sortDirection: string) {
    super();

    this.sortRole = {
      fieldKey: sortByFieldKey,
      order: sortDirection,
    };
    this.setResponseMeta();
  }

  validate() {
    validateFieldKeyExistance(this.model, this.sortRole.fieldKey);
  }

  /**
   * Builds database query of sort by column on the given direction.
   */
  buildQuery() {
    return (builder) => {
      const fieldRelation = getRoleFieldColumn(this.model, this.sortRole.fieldKey);
      const comparatorColumn =
        fieldRelation.relationColumn ||
        `${this.tableName}.${fieldRelation.column}`;

      if (this.sortRole.fieldKey) {
        builder.orderBy(`${comparatorColumn}`, this.sortRole.order);
      }
    };
  }

  /**
   * Sets response meta.
   */
  setResponseMeta() {
    this.responseMeta = {
      sortOrder: this.sortRole.fieldKey,
      sortBy: this.sortRole.order,
    };
  }
}
