import { Model } from 'objection';
import {transform, snakeCase} from 'lodash';
import {mapKeysDeep} from '@/utils';
import PaginationQueryBuilder from '@/models/Pagination';

export default class ModelBase extends Model {
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
}
