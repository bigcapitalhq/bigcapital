import { difference } from 'lodash';
import moment from 'moment';
import { Lexer } from 'lib/LogicEvaluation/Lexer';
import Parser from 'lib/LogicEvaluation/Parser';
import QueryParser from 'lib/LogicEvaluation/QueryParser';
import { IFilterRole, IModel } from 'interfaces';

const numberRoleQueryBuilder = (role: IFilterRole, comparatorColumn: string) => {
  switch (role.comparator) {
    case 'equals':
    case 'equal':
    default:
      return (builder) => {
        builder.where(comparatorColumn, '=', role.value);
      };
    case 'not_equals':
    case 'not_equal':
      return (builder) => {
        builder.whereNot(comparatorColumn, role.value);
      };
    case 'bigger_than':
    case 'bigger':
      return (builder) => {
        builder.where(comparatorColumn, '>', role.value);
      };
    case 'bigger_or_equals':
      return (builder) => {
        builder.where(comparatorColumn, '>=', role.value);
      };
    case 'smaller_than':
    case 'smaller':
      return (builder) => {
        builder.where(comparatorColumn, '<', role.value);
      };
    case 'smaller_or_equals':
      return (builder) => {
        builder.where(comparatorColumn, '<=', role.value);
      };
  }
};

const textRoleQueryBuilder = (role: IFilterRole, comparatorColumn: string) => {
  switch (role.comparator) {
    case 'equals':
    default:
      return (builder) => {
        builder.where(comparatorColumn, role.value);
      };
    case 'not_equal':
    case 'not_equals':
      return (builder) => {
        builder.whereNot(comparatorColumn, role.value);
      };
    case 'contain':
    case 'contains':
      return (builder) => {
        builder.where(comparatorColumn, 'LIKE', `%${role.value}%`);
      };
    case 'not_contain':
    case 'not_contains':
      return (builder) => {
        builder.whereNot(comparatorColumn, 'LIKE', `%${role.value}%`);
      };
  }
};

const dateQueryBuilder = (role: IFilterRole, comparatorColumn: string) => {
  switch(role.comparator) {
    case 'after':
    case 'before':
      return (builder) => {
        const comparator = role.comparator === 'before' ? '<' : '>';
        const hasTimeFormat = moment(role.value, 'YYYY-MM-DD HH:MM', true).isValid();
        const targetDate = moment(role.value);
        const dateFormat = 'YYYY-MM-DD HH:MM:SS';

        if (!hasTimeFormat) {
          if (role.comparator === 'before') {
            targetDate.startOf('day'); 
          } else {
            targetDate.endOf('day'); 
          }
        }
        const comparatorValue = targetDate.format(dateFormat);
        builder.where(comparatorColumn, comparator, comparatorValue);
      };
    case 'in': 
      return (builder) => {
        const hasTimeFormat = moment(role.value, 'YYYY-MM-DD HH:MM', true).isValid();
        const dateFormat = 'YYYY-MM-DD HH:MM:SS';

        if (hasTimeFormat) {
          const targetDateTime = moment(role.value).format(dateFormat);
          builder.where(comparatorColumn, '=', targetDateTime);
        } else {
          const startDate = moment(role.value).startOf('day');
          const endDate = moment(role.value).endOf('day');

          builder.where(comparatorColumn, '>=', startDate.format(dateFormat));
          builder.where(comparatorColumn, '<=', endDate.format(dateFormat));
        }
      };
  }
};

/**
 * Get field column metadata and its relation with other tables.
 * @param {String} tableName - Table name of target column.
 * @param {String} fieldKey - Target column key that stored in resource field.
 */
export function getRoleFieldColumn(model: IModel, fieldKey: string) {
  const tableFields = model.fields;
  return (tableFields[fieldKey]) ? tableFields[fieldKey] : null;
}

/**
 * Builds roles queries.
 * @param {IModel} model -
 * @param {Object} role -
 */
export function buildRoleQuery(model: IModel, role: IFilterRole) {
  const fieldRelation = getRoleFieldColumn(model, role.fieldKey);
  const comparatorColumn = fieldRelation.relationColumn || `${model.tableName}.${fieldRelation.column}`;

  switch (fieldRelation.columnType) {
    case 'number':
      return numberRoleQueryBuilder(role, comparatorColumn);
    case 'date':
      return dateQueryBuilder(role, comparatorColumn);
    case 'text':
    case 'varchar':
    default:
      return textRoleQueryBuilder(role, comparatorColumn);
  } 
}

/**
 * Extract relation table name from relation.
 * @param {String} column -
 * @return {String} - join relation table.
 */
export const getTableFromRelationColumn = (column: string) => {
  const splitedColumn = column.split('.');
  return (splitedColumn.length > 0) ? splitedColumn[0] : '';
};

/**
 * Builds view roles join queries.
 * @param {String} tableName -
 * @param {Array} roles -
 */
export function buildFilterRolesJoins(model: IModel, roles: IFilterRole[]) {
  return (builder) => {
    roles.forEach((role) => {
      const fieldColumn = getRoleFieldColumn(model, role.fieldKey);

      if (fieldColumn.relation) {
        const joinTable = getTableFromRelationColumn(fieldColumn.relation);
        builder.join(joinTable, `${model.tableName}.${fieldColumn.column}`, '=', fieldColumn.relation);
      }
    });
  };
}

export function buildSortColumnJoin(model: IModel, sortColumnKey: string) {
  return (builder) => {
    const fieldColumn = getRoleFieldColumn(model, sortColumnKey);

    if (fieldColumn.relation) {
      const joinTable = getTableFromRelationColumn(fieldColumn.relation);
      builder.join(joinTable, `${model.tableName}.${fieldColumn.column}`, '=', fieldColumn.relation);
    }
  };
}

/**
 * Builds database query from stored view roles.
 *
 * @param {Array} roles -
 * @return {Function}
 */
export function buildFilterRolesQuery(model: IModel, roles: IFilterRole[], logicExpression: string = '') {
  const rolesIndexSet = {};

  roles.forEach((role) => {
    rolesIndexSet[role.index] = buildRoleQuery(model, role);
  });
  // Lexer for logic expression.
  const lexer = new Lexer(logicExpression);
  const tokens = lexer.getTokens();

  // Parse the logic expression.
  const parser = new Parser(tokens);
  const parsedTree = parser.parse();

  const queryParser = new QueryParser(parsedTree, rolesIndexSet);
  return queryParser.parse();
}

/**
 * Builds filter query for query builder.
 * @param {String} tableName -
 * @param {Array} roles -
 * @param {String} logicExpression -
 */
export const buildFilterQuery = (model: IModel, roles: IFilterRole[], logicExpression: string) => {
  return (builder) => {
    buildFilterRolesQuery(model, roles, logicExpression)(builder);
  };
};

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
export function buildSortColumnQuery(model: IModel, columnKey: string, sortDirection: string) {
  const fieldRelation = getRoleFieldColumn(model, columnKey);
  const sortColumn = fieldRelation.relation || `${model.tableName}.${fieldRelation.column}`;

  return (builder) => {
    builder.orderBy(sortColumn, sortDirection);
    buildSortColumnJoin(model, columnKey)(builder);
  };
}
 
export function validateFilterLogicExpression(logicExpression: string, indexes) {
  const logicExpIndexes = logicExpression.match(/\d+/g) || [];
  const diff = difference(logicExpIndexes.map(Number), indexes);

  return (diff.length > 0) ? false : true;
}

export function validateRolesLogicExpression(logicExpression: string, roles: IFilterRole[]) {
  return validateFilterLogicExpression(logicExpression, roles.map((r) => r.index));
}

export function validateFieldKeyExistance(model: any, fieldKey: string) {
  return model?.fields?.[fieldKey] || false;
}

export function validateFilterRolesFieldsExistance(model, filterRoles: IFilterRole[]) {
  return filterRoles.filter((filterRole: IFilterRole) => {
    return !validateFieldKeyExistance(model, filterRole.fieldKey);
  });
}

/**
 * Retrieve model fields keys.
 * @param {IModel} Model 
 * @return {string[]}
 */
export function getModelFieldsKeys(Model: IModel) {
  const fields = Object.keys(Model.fields);

  return fields.sort((a, b) => {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
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
  })
}
