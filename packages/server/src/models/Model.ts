import { Model, mixin } from 'objection';
import DateSession from '../models/DateSession';
import PaginationQueryBuilder from '../models/Pagination';

export default class ModelBase extends mixin(Model, [DateSession]) {
  get timestamps() {
    return [];
  }

  static get knexBinded() {
    return this.knexBindInstance;
  }

  static set knexBinded(knex) {
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
    return this.knexBinded ? model.bindKnex(this.knexBinded) : model;
  }

  static changeAmount(whereAttributes, attribute, amount, trx) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    return this.query(trx).where(whereAttributes)[changeMethod](attribute, Math.abs(amount));
  }
}
