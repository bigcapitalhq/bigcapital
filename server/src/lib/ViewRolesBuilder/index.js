import { difference } from 'lodash';
import moment from 'moment';
import { Lexer } from '@/lib/LogicEvaluation/Lexer';
import Parser from '@/lib/LogicEvaluation/Parser';
import QueryParser from '@/lib/LogicEvaluation/QueryParser';
import resourceFieldsKeys from '@/data/ResourceFieldsKeys';

//  const role = {
//   compatotor: String,
//   value: String,
//   columnKey: String,
//   columnSlug: String,
//   index: Number,
// }


const textRoleQueryBuilder = (role, comparatorColumn) => {
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

const dateQueryBuilder = (role, comparatorColumn) => {
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
 * @param {String} columnKey - Target column key that stored in resource field.
 */
export function getRoleFieldColumn(tableName, columnKey) {
  const tableFields = resourceFieldsKeys[tableName];
  return (tableFields[columnKey]) ? tableFields[columnKey] : null;
}



/**
 * Builds roles queries.
 * @param {String} tableName -
 * @param {Object} role -
 */
export function buildRoleQuery(tableName, role) {
  const fieldRelation = getRoleFieldColumn(tableName, role.columnKey);
  const comparatorColumn = fieldRelation.relationColumn || `${tableName}.${fieldRelation.column}`;

  switch (fieldRelation.columnType) {
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
export const getTableFromRelationColumn = (column) => {
  const splitedColumn = column.split('.');
  return (splitedColumn.length > 0) ? splitedColumn[0] : '';
};

/**
 * Builds view roles join queries.
 * @param {String} tableName -
 * @param {Array} roles -
 */
export function buildFilterRolesJoins(tableName, roles) {
  return (builder) => {
    roles.forEach((role) => {
      const fieldColumn = getRoleFieldColumn(tableName, role.columnKey);

      if (fieldColumn.relation) {
        const joinTable = getTableFromRelationColumn(fieldColumn.relation);
        builder.join(joinTable, `${tableName}.${fieldColumn.column}`, '=', fieldColumn.relation);
      }
    });
  };
}

export function buildSortColumnJoin(tableName, sortColumnKey) {
  return (builder) => {
    const fieldColumn = getRoleFieldColumn(tableName, sortColumnKey);

    if (fieldColumn.relation) {
      const joinTable = getTableFromRelationColumn(fieldColumn.relation);
      builder.join(joinTable, `${tableName}.${fieldColumn.column}`, '=', fieldColumn.relation);
    }
  };
}

/**
 * Builds database query from stored view roles.
 *
 * @param {Array} roles -
 * @return {Function}
 */
export function buildFilterRolesQuery(tableName, roles, logicExpression = '') {
  const rolesIndexSet = {};

  roles.forEach((role) => {
    rolesIndexSet[role.index] = buildRoleQuery(tableName, role);
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
export const buildFilterQuery = (tableName, roles, logicExpression) => {
  return (builder) => {
    buildFilterRolesQuery(tableName, roles, logicExpression)(builder);
  };
};

/**
 * Validates the view logic expression.
 * @param {String} logicExpression -
 * @param {Array} indexes -
 */
export function validateFilterLogicExpression(logicExpression, indexes) {
  const logicExpIndexes = logicExpression.match(/\d+/g) || [];
  return !difference(logicExpIndexes.map(Number), indexes).length;
}

/**
 * Validates view roles.
 * @param {Array} roles -
 * @param {String} logicExpression -
 * @return {Boolean}
 */
export function validateViewRoles(roles, logicExpression) {
  return validateFilterLogicExpression(logicExpression, roles.map((r) => r.index));
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
    columnKey: viewRole.field.key,
    slug: viewRole.field.slug,
    index: viewRole.index,
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
export function buildSortColumnQuery(tableName, columnKey, sortDirection) {
  const fieldRelation = getRoleFieldColumn(tableName, columnKey);
  const sortColumn = fieldRelation.relation || `${tableName}.${fieldRelation.column}`;

  return (builder) => {
    builder.orderBy(sortColumn, sortDirection);
    buildSortColumnJoin(tableName, columnKey)(builder);
  };
}