import { IModel, IFilterRole } from 'interfaces';

export default class DynamicFilterAbstructor {
  /**
   * Extract relation table name from relation.
   * @param {String} column -
   * @return {String} - join relation table.
   */
  protected getTableFromRelationColumn = (column: string) => {
    const splitedColumn = column.split('.');
    return splitedColumn.length > 0 ? splitedColumn[0] : '';
  };

  /**
   * Builds view roles join queries.
   * @param {String} tableName - Table name.
   * @param {Array} roles - Roles.
   */
  protected buildFilterRolesJoins = (model: IModel, roles: IFilterRole[]) => {
    return (builder) => {
      roles.forEach((role) => {
        const field = model.getField(role.fieldKey);

        if (field.relation) {
          const joinTable = this.getTableFromRelationColumn(field.relation);

          builder.join(
            joinTable,
            `${model.tableName}.${field.column}`,
            '=',
            field.relation
          );
        }
      });
    };
  };
}
