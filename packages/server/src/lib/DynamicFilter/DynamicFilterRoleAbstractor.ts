import moment from 'moment';
import * as R from 'ramda';
import { IFilterRole, IDynamicFilter, IModel } from '@/interfaces';
import Parser from '../LogicEvaluation/Parser';
import DynamicFilterQueryParser from './DynamicFilterQueryParser';
import { Lexer } from '../LogicEvaluation/Lexer';
import { COMPARATOR_TYPE, FIELD_TYPE } from './constants';

export default abstract class DynamicFilterAbstractor
  implements IDynamicFilter
{
  protected filterRoles: IFilterRole[] = [];
  protected tableName: string;
  protected model: IModel;
  protected responseMeta: { [key: string]: any } = {};
  public relationFields = [];

  /**
   * Sets model the dynamic filter service.
   * @param {IModel} model
   */
  public setModel(model: IModel) {
    this.model = model;
    this.tableName = model.tableName;
  }

  /**
   * Transformes filter roles to map by index.
   * @param {IModel} model
   * @param {IFilterRole[]} roles
   * @returns
   */
  protected convertRolesMapByIndex = (model, roles) => {
    const rolesIndexSet = {};

    roles.forEach((role) => {
      rolesIndexSet[role.index] = this.buildRoleQuery(model, role);
    });
    return rolesIndexSet;
  };

  /**
   * Builds database query from stored view roles.
   * @param {Array} roles -
   * @return {Function}
   */
  protected buildFilterRolesQuery = (
    model: IModel,
    roles: IFilterRole[],
    logicExpression: string = ''
  ) => {
    const rolesIndexSet = this.convertRolesMapByIndex(model, roles);

    // Lexer for logic expression.
    const lexer = new Lexer(logicExpression);
    const tokens = lexer.getTokens();

    // Parse the logic expression.
    const parser = new Parser(tokens);
    const parsedTree = parser.parse();

    const queryParser = new DynamicFilterQueryParser(parsedTree, rolesIndexSet);

    return queryParser.parse();
  };

  /**
   * Parses the logic expression to base expression.
   * @param {string} logicExpression - 
   * @return {string}
   */
  private parseLogicExpression(logicExpression: string): string {
    return R.compose(
      R.replace(/or|OR/g, '||'),
      R.replace(/and|AND/g, '&&'),
    )(logicExpression);
  }

  /**
   * Builds filter query for query builder.
   * @param {String} tableName - Table name.
   * @param {Array} roles - Filter roles.
   * @param {String} logicExpression - Logic expression.
   */
  protected buildFilterQuery = (
    model: IModel,
    roles: IFilterRole[],
    logicExpression: string
  ) => {
    const basicExpression = this.parseLogicExpression(logicExpression);

    return (builder) => {
      this.buildFilterRolesQuery(model, roles, basicExpression)(builder);
    };
  };

  /**
   * Retrieve relation column of comparator fieldز
   */
  private getFieldComparatorRelationColumn(field) {
    const relation = this.model.relationMappings[field.relationKey];

    if (relation) {
      const relationModel = relation.modelClass;
      const relationColumn =
        field.relationEntityKey === 'id'
          ? 'id'
          : relationModel.getField(field.relationEntityKey, 'column');

      return `${relationModel.tableName}.${relationColumn}`;
    }
  }

  /**
   * Retrieve the comparator field column.
   * @param {IModel} model -
   * @param {} -
   */
  private getFieldComparatorColumn = (field) => {
    return field.fieldType === FIELD_TYPE.RELATION
      ? this.getFieldComparatorRelationColumn(field)
      : `${this.tableName}.${field.column}`;
  };

  /**
   * Builds roles queries.
   * @param {IModel} model -
   * @param {Object} role -
   */
  protected buildRoleQuery = (model: IModel, role: IFilterRole) => {
    const field = model.getField(role.fieldKey);
    const comparatorColumn = this.getFieldComparatorColumn(field);

    // Field relation custom query.
    if (typeof field.filterCustomQuery !== 'undefined') {
      return (builder) => {
        field.filterCustomQuery(builder, role);
      };
    }
    switch (field.fieldType) {
      case FIELD_TYPE.BOOLEAN:
      case FIELD_TYPE.ENUMERATION:
        return this.booleanRoleQueryBuilder(role, comparatorColumn);
      case FIELD_TYPE.NUMBER:
        return this.numberRoleQueryBuilder(role, comparatorColumn);
      case FIELD_TYPE.DATE:
        return this.dateQueryBuilder(role, comparatorColumn);
      case FIELD_TYPE.TEXT:
      default:
        return this.textRoleQueryBuilder(role, comparatorColumn);
    }
  };

  /**
   * Boolean column query builder.
   * @param {IFilterRole} role
   * @param {string} comparatorColumn
   * @returns
   */
  protected booleanRoleQueryBuilder = (
    role: IFilterRole,
    comparatorColumn: string
  ) => {
    switch (role.comparator) {
      case COMPARATOR_TYPE.EQUALS:
      case COMPARATOR_TYPE.EQUAL:
      case COMPARATOR_TYPE.IS:
      default:
        return (builder) => {
          builder.where(comparatorColumn, '=', role.value);
        };
      case COMPARATOR_TYPE.NOT_EQUAL:
      case COMPARATOR_TYPE.NOT_EQUALS:
      case COMPARATOR_TYPE.IS_NOT:
        return (builder) => {
          builder.where(comparatorColumn, '<>', role.value);
        };
    }
  };

  /**
   * Numeric column query builder.
   * @param {IFilterRole} role
   * @param {string} comparatorColumn
   * @returns
   */
  protected numberRoleQueryBuilder = (
    role: IFilterRole,
    comparatorColumn: string
  ) => {
    switch (role.comparator) {
      case COMPARATOR_TYPE.EQUALS:
      case COMPARATOR_TYPE.EQUAL:
      default:
        return (builder) => {
          builder.where(comparatorColumn, '=', role.value);
        };
      case COMPARATOR_TYPE.NOT_EQUAL:
      case COMPARATOR_TYPE.NOT_EQUALS:
        return (builder) => {
          builder.whereNot(comparatorColumn, role.value);
        };
      case COMPARATOR_TYPE.BIGGER_THAN:
      case COMPARATOR_TYPE.BIGGER:
        return (builder) => {
          builder.where(comparatorColumn, '>', role.value);
        };
      case COMPARATOR_TYPE.BIGGER_OR_EQUALS:
        return (builder) => {
          builder.where(comparatorColumn, '>=', role.value);
        };
      case COMPARATOR_TYPE.SMALLER_THAN:
      case COMPARATOR_TYPE.SMALLER:
        return (builder) => {
          builder.where(comparatorColumn, '<', role.value);
        };
      case COMPARATOR_TYPE.SMALLER_OR_EQUALS:
        return (builder) => {
          builder.where(comparatorColumn, '<=', role.value);
        };
    }
  };

  /**
   * Text column query builder.
   * @param {IFilterRole} role
   * @param {string} comparatorColumn
   * @returns {Function}
   */
  protected textRoleQueryBuilder = (
    role: IFilterRole,
    comparatorColumn: string
  ) => {
    switch (role.comparator) {
      case COMPARATOR_TYPE.EQUAL:
      case COMPARATOR_TYPE.EQUALS:
      case COMPARATOR_TYPE.IS:
      default:
        return (builder) => {
          builder.where(comparatorColumn, role.value);
        };
      case COMPARATOR_TYPE.NOT_EQUALS:
      case COMPARATOR_TYPE.NOT_EQUAL:
      case COMPARATOR_TYPE.IS_NOT:
        return (builder) => {
          builder.whereNot(comparatorColumn, role.value);
        };
      case COMPARATOR_TYPE.CONTAIN:
      case COMPARATOR_TYPE.CONTAINS:
        return (builder) => {
          builder.where(comparatorColumn, 'LIKE', `%${role.value}%`);
        };
      case COMPARATOR_TYPE.NOT_CONTAIN:
      case COMPARATOR_TYPE.NOT_CONTAINS:
        return (builder) => {
          builder.whereNot(comparatorColumn, 'LIKE', `%${role.value}%`);
        };
      case COMPARATOR_TYPE.STARTS_WITH:
      case COMPARATOR_TYPE.START_WITH:
        return (builder) => {
          builder.where(comparatorColumn, 'LIKE', `${role.value}%`);
        };
      case COMPARATOR_TYPE.ENDS_WITH:
      case COMPARATOR_TYPE.END_WITH:
        return (builder) => {
          builder.where(comparatorColumn, 'LIKE', `%${role.value}`);
        };

    }
  };

  /**
   * Date column query builder.
   * @param {IFilterRole} role
   * @param {string} comparatorColumn
   * @returns {Function}
   */
  protected dateQueryBuilder = (
    role: IFilterRole,
    comparatorColumn: string
  ) => {
    switch (role.comparator) {
      case COMPARATOR_TYPE.AFTER:
      case COMPARATOR_TYPE.BEFORE:
        return (builder) => {
          this.dateQueryAfterBeforeComparator(role, comparatorColumn, builder);
        };
      case COMPARATOR_TYPE.IN:
        return (builder) => {
          this.dateQueryInComparator(role, comparatorColumn, builder);
        };
    }
  };

  /**
   * Date query 'IN' comparator type.
   * @param {IFilterRole} role
   * @param {string} comparatorColumn
   * @param builder
   */
  protected dateQueryInComparator = (
    role: IFilterRole,
    comparatorColumn: string,
    builder
  ) => {
    const hasTimeFormat = moment(
      role.value,
      'YYYY-MM-DD HH:MM',
      true
    ).isValid();
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

  /**
   * Date query after/before comparator type.
   * @param {IFilterRole} role
   * @param {string} comparatorColumn - Column.
   * @param builder
   */
  protected dateQueryAfterBeforeComparator = (
    role: IFilterRole,
    comparatorColumn: string,
    builder
  ) => {
    const comparator = role.comparator === COMPARATOR_TYPE.BEFORE ? '<' : '>';
    const hasTimeFormat = moment(
      role.value,
      'YYYY-MM-DD HH:MM',
      true
    ).isValid();
    const targetDate = moment(role.value);
    const dateFormat = 'YYYY-MM-DD HH:MM:SS';

    if (!hasTimeFormat) {
      if (role.comparator === COMPARATOR_TYPE.BEFORE) {
        targetDate.startOf('day');
      } else {
        targetDate.endOf('day');
      }
    }
    const comparatorValue = targetDate.format(dateFormat);
    builder.where(comparatorColumn, comparator, comparatorValue);
  };

  /**
   * Registers relation field if the given field was relation type
   * and not registered.
   * @param {string} fieldKey - Field key.
   */
  protected setRelationIfRelationField = (fieldKey: string): void => {
    const field = this.model.getField(fieldKey);
    const isAlreadyRegistered = this.relationFields.some(
      (field) => field === fieldKey
    );

    if (
      !isAlreadyRegistered &&
      field &&
      field.fieldType === FIELD_TYPE.RELATION
    ) {
      this.relationFields.push(field.relationKey);
    }
  };

  /**
   * Retrieve the model.
   */
  getModel() {
    return this.model;
  }

  /**
   * On initialize the registered dynamic filter.
   */
  onInitialize() {}
}
