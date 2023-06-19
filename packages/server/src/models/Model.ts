import { Model, mixin } from 'objection';
import { snakeCase, transform } from 'lodash';
import { mapKeysDeep } from 'utils';
import PaginationQueryBuilder from 'models/Pagination';
import DateSession from 'models/DateSession';

export default class ModelBase extends mixin(Model, [DateSession]) {
  get timestamps() {
    return [];
  }

  static get knexBound() {
    return this.knexBindInstance;
  }

  static set knexBound(knex) {
    this.knexBindInstance = knex;
  }

  static get collection() {
    return Array;
  }

  static query(...args) {
    return super.query(...args).runAfter((result) => {
      if (Array.isArray(result)) {
        return this.collection.from(result);
      }
      return result;
    });
  }

  static get QueryBuilder() {
    return PaginationQueryBuilder;
  }

  static relationBindKnex(model) {
    return this.knexBound ? model.bindKnex(this.knexBound) : model;
  }

  static changeAmount(whereAttributes, attribute, amount, trx) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    return this.query(trx)
      .where(whereAttributes)
      [changeMethod](attribute, Math.abs(amount));
  }
}
