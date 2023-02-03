import { QueryBuilder } from 'objection';
import crypto from 'crypto';
import CacheService from '@/services/Cache';

export default class CachableQueryBuilder extends QueryBuilder{

  async then(...args) {
    // Flush model cache after insert, delete or update transaction.
    if (this.isInsert() || this.isDelete() || this.isUpdate()) {
      this.modelClass().flushCache();
    }
    if (this.cacheTag && this.isFind()) {
      this.setCacheKey();
      return this.getOrStoreCache().then(...args);
    } else {
      const promise = this.execute();
    
      return promise.then((result) => {
        this.setCache(result);
        return result;
      }).then(...args);
    }
  }

  getOrStoreCache() {
    const storeFunction = () => this.execute();

    return new Promise((resolve, reject) => {
      CacheService.get(this.cacheKey, storeFunction)
        .then((result) => { resolve(result); });
    });
  }

  setCache(results) {
    CacheService.set(`${this.cacheKey}`, results, this.cacheSeconds);
  }

  generateCacheKey() {
    const knexSql = this.toKnexQuery().toSQL();
    const hashedQuery = crypto.createHash('md5').update(knexSql.sql).digest("hex");

    return hashedQuery;
  }

  remember(key, seconds) {
    const modelName = this.modelClass().name;

    this.cacheSeconds = seconds;
    this.cacheTag = (key) ? `${modelName}.${key}` : modelName;

    return this;
  }

  withGraphFetched(relation, settings) {
    if (!this.graphAppends) {
      this.graphAppends = [relation];
    } else {
      this.graphAppends.push(relation);
    }
    return super.withGraphFetched(relation, settings);
  }

  setCacheKey() {
    const hashedQuery = this.generateCacheKey();
    const appends = (this.graphAppends || []).join(this.graphAppends, ',');

    this.cacheKey = `${this.cacheTag}.${hashedQuery}.${appends}`;
  }
}