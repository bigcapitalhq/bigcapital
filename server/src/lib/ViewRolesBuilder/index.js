import { difference } from 'lodash';
import { Lexer } from '@/lib/LogicEvaluation/Lexer';
import Parser from '@/lib/LogicEvaluation/Parser';
import QueryParser from '@/lib/LogicEvaluation/QueryParser';
import resourceFieldsKeys from '@/data/ResourceFieldsKeys';

//  const role = {
//   compatotor: '',
//   value: '',
//   columnKey: '',
//   columnSlug: '',
//   index: 1,
// }

export function buildRoleQuery(role) {
  const columnName = resourceFieldsKeys[role.columnKey];

  switch (role.comparator) {
    case 'equals':
    default:
      return (builder) => {
        builder.where(columnName, role.value);
      };
    case 'not_equal':
    case 'not_equals':
      return (builder) => {
        builder.whereNot(columnName, role.value);
      };
  }
}

/**
 * Builds database query from stored view roles.
 *
 * @param {Array} roles -
 * @return {Function}
 */
export function viewRolesBuilder(roles, logicExpression = '') {
  const rolesIndexSet = {};

  roles.forEach((role) => {
    rolesIndexSet[role.index] = buildRoleQuery(role);
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
 * Validates the view logic expression.
 * @param {String} logicExpression 
 * @param {Array} indexes 
 */
export function validateViewLogicExpression(logicExpression, indexes) {
  const logicExpIndexes = logicExpression.match(/\d+/g) || [];
  return !difference(logicExpIndexes.map(Number), indexes).length;
}

/**
 * 
 * @param {Array} roles -
 * @param {String} logicExpression -
 * @return {Boolean}
 */
export function validateViewRoles(roles, logicExpression) {
  return validateViewLogicExpression(logicExpression, roles.map((r) => r.index));
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
    columnKey: viewRole.field.columnKey,
    slug: viewRole.field.slug,
    index: viewRole.index,
  }));
}