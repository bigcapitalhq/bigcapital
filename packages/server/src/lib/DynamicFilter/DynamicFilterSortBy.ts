import DynamicFilterRoleAbstractor from '@/lib/DynamicFilter/DynamicFilterRoleAbstractor';
import { FIELD_TYPE } from './constants';

interface ISortRole {
  fieldKey: string;
  order: string;
}

export default class DynamicFilterSortBy extends DynamicFilterRoleAbstractor {
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
   * On initialize the dynamic sort by.
   */
  public onInitialize() {
    this.setRelationIfRelationField(this.sortRole.fieldKey);
  }

  /**
   * Retrieve field comparator relatin column.
   * @param field 
   * @returns {string}
   */
  private getFieldComparatorRelationColumn = (field): string => {
    const relation = this.model.relationMappings[field.relationKey];

    if (relation) {
      const relationModel = relation.modelClass;
      const relationField = relationModel.getField(field.relationEntityLabel);

      return `${relationModel.tableName}.${relationField.column}`;
    }
    return '';
  };

  /**
   * Retrieve the comparator field column.
   * @param {IModel} field
   * @returns {string}
   */
  private getFieldComparatorColumn = (field): string => {
    return field.fieldType === FIELD_TYPE.RELATION
      ? this.getFieldComparatorRelationColumn(field)
      : `${this.tableName}.${field.column}`;
  };

  /**
   * Builds database query of sort by column on the given direction.
   */
  public buildQuery = () => {
    const field = this.model.getField(this.sortRole.fieldKey);
    const comparatorColumn = this.getFieldComparatorColumn(field);

    // Sort custom query.
    if (typeof field.sortCustomQuery !== 'undefined') {
      return (builder) => {
        field.sortCustomQuery(builder, this.sortRole);
      };
    }

    return (builder) => {
      if (this.sortRole.fieldKey) {
        builder.orderBy(`${comparatorColumn}`, this.sortRole.order);
      }
    };
  };

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
