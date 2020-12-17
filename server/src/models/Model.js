import { Model, mixin } from 'objection';
import { snakeCase } from 'lodash';
import { mapKeysDeep } from 'utils';
import PaginationQueryBuilder from 'models/Pagination';
import DateSession from 'models/DateSession';

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

  $formatJson(json, opt) {
    const transformed = mapKeysDeep(json, (value, key) => {
      return snakeCase(key);
    });
    const parsedJson = super.$formatJson(transformed, opt);
    return parsedJson;
  }

  static get QueryBuilder() {
    return PaginationQueryBuilder;
  }

  static relationBindKnex(model) {
    return this.knexBinded ? model.bindKnex(this.knexBinded) : model;
  }
}
