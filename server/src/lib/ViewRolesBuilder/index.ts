import { difference, filter } from 'lodash';
import moment from 'moment';
import { Lexer } from 'lib/LogicEvaluation/Lexer';
import Parser from 'lib/LogicEvaluation/Parser';
import QueryParser from 'lib/LogicEvaluation/QueryParser';
import resourceFieldsKeys from 'data/ResourceFieldsKeys';
import { IFilterRole } from 'interfaces';

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
export function getRoleFieldColumn(tableName: string, fieldKey: string) {
  const tableFields = resourceFieldsKeys[tableName];
  return (tableFields[fieldKey]) ? tableFields[fieldKey] : null;
}

/**
 * Builds roles queries.
 * @param {String} tableName -
 * @param {Object} role -
 */
export function buildRoleQuery(tableName: string, role: IFilterRole) {
  const fieldRelation = getRoleFieldColumn(tableName, role.fieldKey);
  const comparatorColumn = fieldRelation.relationColumn || `${tableName}.${fieldRelation.column}`;

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
export function buildFilterRolesJoins(tableName: string, roles: IFilterRole[]) {
  return (builder) => {
    roles.forEach((role) => {
      const fieldColumn = getRoleFieldColumn(tableName, role.fieldKey);

      if (fieldColumn.relation) {
        const joinTable = getTableFromRelationColumn(fieldColumn.relation);
        builder.join(joinTable, `${tableName}.${fieldColumn.column}`, '=', fieldColumn.relation);
      }
    });
  };
}

export function buildSortColumnJoin(tableName: string, sortColumnKey: string) {
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
export function buildFilterRolesQuery(tableName: string, roles: IFilterRole[], logicExpression: string = '') {
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
export const buildFilterQuery = (tableName: string, roles, logicExpression: string) => {
  return (builder) => {
    buildFilterRolesQuery(tableName, roles, logicExpression)(builder);
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
export function buildSortColumnQuery(tableName: string, columnKey: string, sortDirection: string) {
  const fieldRelation = getRoleFieldColumn(tableName, columnKey);
  const sortColumn = fieldRelation.relation || `${tableName}.${fieldRelation.column}`;

  return (builder) => {
    builder.orderBy(sortColumn, sortDirection);
    buildSortColumnJoin(tableName, columnKey)(builder);
  };
}
 
export function validateFilterLogicExpression(logicExpression: string, indexes) {
  const logicExpIndexes = logicExpression.match(/\d+/g) || [];
  const diff = !difference(logicExpIndexes.map(Number), indexes).length;

}

export function validateRolesLogicExpression(logicExpression: string, roles: IFilterRole[]) {
  return validateFilterLogicExpression(logicExpression, roles.map((r) => r.index));
}

export function validateFieldKeyExistance(tableName: string, fieldKey: string) {
  if (!resourceFieldsKeys?.[tableName]?.[fieldKey])
    return fieldKey;
  else
    return false;
}

export function validateFilterRolesFieldsExistance(tableName, filterRoles: IFilterRole[]) {
  return filterRoles.filter((filterRole: IFilterRole) => {
    return validateFieldKeyExistance(tableName, filterRole.fieldKey);
  });
}