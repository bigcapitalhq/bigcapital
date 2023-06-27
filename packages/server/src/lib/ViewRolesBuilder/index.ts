import { difference } from 'lodash';

import { IFilterRole, IModel } from '@/interfaces';

/**
 * Get field column metadata and its relation with other tables.
 * @param {String} tableName - Table name of target column.
 * @param {String} fieldKey - Target column key that stored in resource field.
 */
export function getRoleFieldColumn(model: IModel, fieldKey: string) {
  const tableFields = model.fields;
  return tableFields[fieldKey] ? tableFields[fieldKey] : null;
}

export function buildSortColumnJoin(model: IModel, sortColumnKey: string) {
  return (builder) => {
    const fieldColumn = getRoleFieldColumn(model, sortColumnKey);

    if (fieldColumn.relation) {
      const joinTable = getTableFromRelationColumn(fieldColumn.relation);
      builder.join(
        joinTable,
        `${model.tableName}.${fieldColumn.column}`,
        '=',
        fieldColumn.relation
      );
    }
  };
}

/**
 * Mapes the view roles to view conditionals.
 * @param {Array} viewRoles -
 * @return {Array}
 */
export function mapViewRolesToConditionals(viewRoles) {
  return viewRoles.map((viewRole) => ({
    comparator: viewRole.comparator,
    value: viewRole.value,
    index: viewRole.index,

    columnKey: viewRole.field.key,
    slug: viewRole.field.slug,
  }));
}

export function mapFilterRolesToDynamicFilter(roles) {
  return roles.map((role) => ({
    ...role,
    columnKey: role.fieldKey,
  }));
}

/**
 * Builds sort column query.
 * @param {String} tableName -
 * @param {String} columnKey -
 * @param {String} sortDirection -
 */
export function buildSortColumnQuery(
  model: IModel,
  columnKey: string,
  sortDirection: string
) {
  const fieldRelation = getRoleFieldColumn(model, columnKey);
  const sortColumn =
    fieldRelation.relation || `${model.tableName}.${fieldRelation.column}`;

  return (builder) => {
    builder.orderBy(sortColumn, sortDirection);
    buildSortColumnJoin(model, columnKey)(builder);
  };
}

export function validateFilterLogicExpression(
  logicExpression: string,
  indexes
) {
  const logicExpIndexes = logicExpression.match(/\d+/g) || [];
  const diff = difference(logicExpIndexes.map(Number), indexes);

  return diff.length > 0 ? false : true;
}

export function validateRolesLogicExpression(
  logicExpression: string,
  roles: IFilterRole[]
) {
  return validateFilterLogicExpression(
    logicExpression,
    roles.map((r) => r.index)
  );
}

export function validateFieldKeyExistence(model: any, fieldKey: string) {
  return model?.fields?.[fieldKey] || false;
}


/**
 * Retrieve model fields keys.
 * @param {IModel} Model
 * @return {string[]}
 */
export function getModelFieldsKeys(Model: IModel) {
  const fields = Object.keys(Model.fields);

  return fields.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
}

export function getModelFields(Model: IModel) {
  const fieldsKey = this.getModelFieldsKeys(Model);

  return fieldsKey.map((fieldKey) => {
    const field = Model.fields[fieldKey];
    return {
      ...field,
      key: fieldKey,
    };
  });
}
