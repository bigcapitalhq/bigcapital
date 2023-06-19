
export default class DynamicFilterAbstractor {
  /**
   * Extract relation table name from relation.
   * @param {String} column -
   * @return {String} - join relation table.
   */
  protected getTableFromRelationColumn = (column: string) => {
    const splitColumn = column.split('.');
    return splitColumn.length > 0 ? splitColumn[0] : '';
  };

  /**
   * Builds view roles join queries.
   * @param {String} tableName - Table name.
   * @param {Array} roles - Roles.
   */
  protected buildFilterRolesJoins = (builder) => {
    this.dynamicFilters.forEach((dynamicFilter) => {
      const relationsFields = dynamicFilter.relationFields;

      this.buildFieldsJoinQueries(builder, relationsFields);
    });
  };

  /**
   * Builds join queries of fields.
   * @param builder - 
   * @param {string[]} fieldsRelations -
   */
  private buildFieldsJoinQueries = (builder, fieldsRelations: string[]) => {
    fieldsRelations.forEach((fieldRelation) => {
      const relation = this.model.relationMappings[fieldRelation];

      if (relation) {
        const splitToRelation = relation.join.to.split('.');
        const relationTable = splitToRelation[0] || '';

        builder.join(relationTable, relation.join.from, '=', relation.join.to);
      }
    });
  };

  /**
   * Retrieve the dynamic filter mode.
   */
  protected getModel() {
    return this.model;
  }
}
