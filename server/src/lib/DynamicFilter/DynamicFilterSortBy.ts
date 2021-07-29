import DynamicFilterRoleAbstructor from 'lib/DynamicFilter/DynamicFilterRoleAbstructor';
import {
  getRoleFieldColumn,
  validateFieldKeyExistance,
  getTableFromRelationColumn,
} from 'lib/ViewRolesBuilder';

interface ISortRole {
  fieldKey: string;
  order: string;
}

export default class DynamicFilterSortBy extends DynamicFilterRoleAbstructor {
  private sortRole: ISortRole = {};

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


  /**
   * Builds database query of sort by column on the given direction.
   */
  public buildQuery() {
    const field = this.model.getField(this.sortRole.fieldKey);
    const comparatorColumn = `${this.tableName}.${field.column}`;

    if (typeof field.customSortQuery !== 'undefined') {
      return (builder) => {
        field.customSortQuery(builder, this.sortRole);
      };
    }

    return (builder) => {
      if (this.sortRole.fieldKey) {
        builder.orderBy(`${comparatorColumn}`, this.sortRole.order);
      }
    };
  }

  private joinBuildQuery() {
    const fieldColumn = getRoleFieldColumn(this.model, this.sortRole.fieldKey);

    return (builder) => {
      if (fieldColumn.relation) {
        const joinTable = getTableFromRelationColumn(fieldColumn.relation);

        builder.join(
          joinTable,
          `${this.model.tableName}.${fieldColumn.column}`,
          '=',
          fieldColumn.relation
        );
      }
    };
  }

  /**
   * Sets response meta.
   */
  public setResponseMeta() {
    this.responseMeta = {
      sortOrder: this.sortRole.fieldKey,
      sortBy: this.sortRole.order,
    };
  }
}
