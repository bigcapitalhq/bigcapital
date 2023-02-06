import hashObject from 'object-hash';
import EntityRepository from './EntityRepository';

export default class CachableRepository extends EntityRepository {
  repositoryName: string;
  cache: any;
  i18n: any;

  /**
   * Constructor method.
   * @param {Knex} knex
   * @param {Cache} cache
   */
  constructor(knex, cache, i18n) {
    super(knex);

    this.cache = cache;
    this.i18n = i18n;
    this.repositoryName = this.constructor.name;
  }

  getByCache(key, callback) {
    return callback();
  }

  /**
   * Retrieve the cache key of the method name and arguments.
   * @param {string} method
   * @param {...any} args
   * @return {string}
   */
  getCacheKey(method, ...args) {
    const hashArgs = hashObject({ ...args });
    const repositoryName = this.repositoryName;

    return `${repositoryName}-${method}-${hashArgs}`;
  }

  /**
   * Retrieve all entries with specified relations.
   * @param withRelations
   */
  all(withRelations?, trx?) {
    const cacheKey = this.getCacheKey('all', withRelations);

    return this.getByCache(cacheKey, () => {
      return super.all(withRelations, trx);
    });
  }

  /**
   * Finds list of entities with specified attributes
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve.
   * @returns {Promise<Object[]>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  find(attributeValues = {}, withRelations?) {
    const cacheKey = this.getCacheKey('find', attributeValues, withRelations);

    return this.getByCache(cacheKey, () => {
      return super.find(attributeValues, withRelations);
    });
  }

  /**
   * Finds list of entities with attribute values that are different from specified ones
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object[]>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  findWhereNot(attributeValues = {}, withRelations?) {
    const cacheKey = this.getCacheKey(
      'findWhereNot',
      attributeValues,
      withRelations
    );

    return this.getByCache(cacheKey, () => {
      return super.findWhereNot(attributeValues, withRelations);
    });
  }

  /**
   * Finds list of entities with specified attributes (any of multiple specified values)
   * Supports both ('attrName', ['value1', 'value2]) and ({attrName: ['value1', 'value2']} formats)
   *
   * @param {string|Object} searchParam - attribute name or search criteria object
   * @param {*[]} [attributeValues] - attribute values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {PromiseLike<Object[]>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  findWhereIn(searchParam, attributeValues, withRelations?) {
    const cacheKey = this.getCacheKey(
      'findWhereIn',
      attributeValues,
      withRelations
    );

    return this.getByCache(cacheKey, () => {
      return super.findWhereIn(searchParam, attributeValues, withRelations);
    });
  }

  /**
   * Finds first entity by given parameters
   *
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object>}
   */
  findOne(attributeValues = {}, withRelations?) {
    const cacheKey = this.getCacheKey(
      'findOne',
      attributeValues,
      withRelations
    );

    return this.getByCache(cacheKey, () => {
      return super.findOne(attributeValues, withRelations);
    });
  }

  /**
   * Finds first entity by given parameters
   *
   * @param {string || number} id - value of id column of the entity
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object>}
   */
  findOneById(id, withRelations?) {
    const cacheKey = this.getCacheKey('findOneById', id, withRelations);

    return this.getByCache(cacheKey, () => {
      return super.findOneById(id, withRelations);
    });
  }

  /**
   * Persists new entity or an array of entities.
   * This method does not recursively persist related entities, use createRecursively (to be implemented) for that.
   * Batch insert only works on PostgreSQL
   * @param {Object} entity - model instance or parameters for a new entity
   * @returns {Promise<Object>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  async create(entity, trx?) {
    const result = await super.create(entity, trx);

    // Flushes the repository cache after insert operation.
    this.flushCache();

    return result;
  }

  /**
   * Persists updated entity. If previously set fields are not present, performs an incremental update (does not remove fields unless explicitly set to null)
   *
   * @param {Object} entity - single entity instance
   * @param {Object} [trx] - knex transaction instance. If not specified, new implicit transaction will be used.
   * @returns {Promise<integer>} number of affected rows
   */
  async update(entity, whereAttributes?, trx?) {
    const result = await super.update(entity, whereAttributes, trx);

    // Flushes the repository cache after update operation.
    this.flushCache();

    return result;
  }

  /**
   * @param {Object} attributeValues - values to filter deleted entities by
   * @param {Object} [trx]
   * @returns {Promise<integer>} Query builder. After promise is resolved, returns count of deleted rows
   */
  async deleteBy(attributeValues, trx?) {
    const result = await super.deleteBy(attributeValues, trx);
    this.flushCache();

    return result;
  }

  /**
   * @param {string || number} id - value of id column of the entity
   * @returns {Promise<integer>} Query builder. After promise is resolved, returns count of deleted rows
   */
  deleteById(id: number | string, trx?) {
    const result = super.deleteById(id, trx);

    // Flushes the repository cache after insert operation.
    this.flushCache();

    return result;
  }

  /**
   *
   * @param {string|number[]} values -
   */
  async deleteWhereIn(field: string, values: string | number[]) {
    const result = await super.deleteWhereIn(field, values);

    // Flushes the repository cache after delete operation.
    this.flushCache();

    return result;
  }

  /**
   *
   * @param {string|number[]} values
   */
  async deleteWhereIdIn(values: string | number[], trx?) {
    const result = await super.deleteWhereIdIn(values, trx);

    // Flushes the repository cache after delete operation.
    this.flushCache();

    return result;
  }

  /**
   *
   * @param graph
   * @param options
   */
  async upsertGraph(graph, options) {
    const result = await super.upsertGraph(graph, options);

    // Flushes the repository cache after insert operation.
    this.flushCache();

    return result;
  }

  /**
   *
   * @param {} whereAttributes
   * @param {string} field
   * @param {number} amount
   */
  async changeNumber(whereAttributes, field: string, amount: number, trx?) {
    const result = await super.changeNumber(
      whereAttributes,
      field,
      amount,
      trx
    );

    // Flushes the repository cache after update operation.
    this.flushCache();

    return result;
  }

  /**
   * Flush repository cache.
   */
  flushCache(): void {
    this.cache.delStartWith(this.repositoryName);
  }
}
