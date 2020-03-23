import { difference } from 'lodash';
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
  const comparatorColumn = fieldRelation.relation || `${tableName}.${fieldRelation.column}`;

  console.log(comparatorColumn, role.value);
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
      return (builder) => {
        builder.where(comparatorColumn, 'LIKE', `%${role.value}%`);
      };
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
    buildFilterRolesJoins(tableName, roles)(builder);
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