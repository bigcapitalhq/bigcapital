import DynamicFilterRoleAbstructor from 'lib/DynamicFilter/DynamicFilterRoleAbstructor';
import {
  getRoleFieldColumn,
  validateFieldKeyExistance,
  getTableFromRelationColumn,
} from 'lib/ViewRolesBuilder';

export default class DynamicFilterSortBy extends DynamicFilterRoleAbstructor {
  sortRole: { fieldKey: string; order: string } = {};

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
   * Validate the given field key with the model.
   */
  validate() {
    validateFieldKeyExistance(this.model, this.sortRole.fieldKey);
  }

  /**
   * Builds database query of sort by column on the given direction.
   */
  buildQuery() {
    const fieldRelation = getRoleFieldColumn(
      this.model,
      this.sortRole.fieldKey
    );
    const comparatorColumn =
      fieldRelation.relationColumn ||
      `${this.tableName}.${fieldRelation.column}`;

    if (typeof fieldRelation.sortQuery !== 'undefined') {
      return (builder) => {
        fieldRelation.sortQuery(builder, this.sortRole);
      };
    }
    return (builder) => {
      if (this.sortRole.fieldKey) {
        builder.orderBy(`${comparatorColumn}`, this.sortRole.order);
      }
      this.joinBuildQuery()(builder);
    };
  }

  joinBuildQuery() {
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
  setResponseMeta() {
    this.responseMeta = {
      sortOrder: this.sortRole.fieldKey,
      sortBy: this.sortRole.order,
    };
  }
}
