import { cloneDeep, forOwn, isString } from 'lodash';
import ModelEntityNotFound from 'exceptions/ModelEntityNotFound';

function applyGraphFetched(withRelations, builder) {
  const relations = Array.isArray(withRelations)
    ? withRelations
    : typeof withRelations === 'string'
    ? withRelations.split(',').map((relation) => relation.trim())
    : [];

  relations.forEach((relation) => {
    builder.withGraphFetched(relation);
  });
}

export default class EntityRepository {
  idColumn: string;
  knex: any;

  /**
   * Constructor method.
   * @param {Knex} knex
   */
  constructor(knex) {
    this.knex = knex;
    this.idColumn = 'id';
  }

  /**
   * Retrieve the repository model bound it to knex instance.
   */
  get model() {
    throw new Error("The repository's model is not defined.");
  }

  /**
   * Retrieve all entries with specified relations.
   *
   * @param withRelations
   */
  all(withRelations?, trx?) {
    const builder = this.model.query(trx);
    applyGraphFetched(withRelations, builder);

    return builder;
  }

  /**
   * Finds list of entities with specified attributes
   *
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve.
   * @returns {Promise<Object[]>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  find(attributeValues = {}, withRelations?) {
    const builder = this.model.query().where(attributeValues);

    applyGraphFetched(withRelations, builder);
    return builder;
  }

  /**
   * Finds list of entities with attribute values that are different from specified ones
   *
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {PromiseLike<Object[]>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  findWhereNot(attributeValues = {}, withRelations?) {
    const builder = this.model.query().whereNot(attributeValues);

    applyGraphFetched(withRelations, builder);
    return builder;
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
    const commonBuilder = (builder) => {
      applyGraphFetched(withRelations, builder);
    };
    if (isString(searchParam)) {
      return this.model
        .query()
        .whereIn(searchParam, attributeValues)
        .onBuild(commonBuilder);
    } else {
      const builder = this.model.query(this.knex).onBuild(commonBuilder);

      forOwn(searchParam, (value, key) => {
        if (Array.isArray(value)) {
          builder.whereIn(key, value);
        } else {
          builder.where(key, value);
        }
      });
      return builder;
    }
  }

  /**
   * Finds first entity by given parameters
   *
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object>}
   */
  async findOne(attributeValues = {}, withRelations?) {
    const results = await this.find(attributeValues, withRelations);
    return results[0] || null;
  }

  /**
   * Finds first entity by given parameters
   *
   * @param {string || number} id - value of id column of the entity
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object>}
   */
  findOneById(id, withRelations?) {
    return this.findOne({ [this.idColumn]: id }, withRelations);
  }

  /**
   * Persists new entity or an array of entities.
   * This method does not recursively persist related entities, use createRecursively (to be implemented) for that.
   * Batch insert only works on PostgreSQL
   *
   * @param {Object} entity - model instance or parameters for a new entity
   * @returns {Promise<Object>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  create(entity, trx?) {
    // Keep the input parameter immutable
    const instanceDTO = cloneDeep(entity);

    return this.model.query(trx).insert(instanceDTO);
  }

  /**
   * Persists updated entity. If previously set fields are not present, performs an incremental update (does not remove fields unless explicitly set to null)
   *
   * @param   {Object} entity - single entity instance
   * @returns {Promise<integer>} number of affected rows
   */
  async update(entity, whereAttributes?, trx?) {
    const entityDto = cloneDeep(entity);
    const identityClause = {};

    if (Array.isArray(this.idColumn)) {
      this.idColumn.forEach(
        (idColumn) => (identityClause[idColumn] = entityDto[idColumn])
      );
    } else {
      identityClause[this.idColumn] = entityDto[this.idColumn];
    }
    const whereConditions = whereAttributes || identityClause;
    const modifiedEntitiesCount = await this.model
      .query(trx)
      .where(whereConditions)
      .update(entityDto);

    if (modifiedEntitiesCount === 0) {
      throw new ModelEntityNotFound(entityDto[this.idColumn]);
    }
    return modifiedEntitiesCount;
  }

  /**
   *
   * @param {Object} attributeValues - values to filter deleted entities by
   * @param {Object} [trx]
   * @returns {Promise<integer>} Query builder. After promise is resolved, returns count of deleted rows
   */
  deleteBy(attributeValues, trx?) {
    return this.model.query(trx).delete().where(attributeValues);
  }

  /**
   * @param {string || number} id - value of id column of the entity
   * @returns {Promise<integer>} Query builder. After promise is resolved, returns count of deleted rows
   */
  deleteById(id: number | string, trx?) {
    return this.deleteBy(
      {
        [this.idColumn]: id,
      },
      trx
    );
  }

  /**
   * Deletes the given entries in the array on the specific field.
   * @param {string} field -
   * @param {number|string} values -
   */
  deleteWhereIn(field: string, values: string | number[], trx) {
    return this.model.query(trx).whereIn(field, values).delete();
  }

  /**
   *
   * @param {string|number[]} values
   */
  deleteWhereIdIn(values: string | number[], trx?) {
    return this.deleteWhereIn(this.idColumn, values, trx);
  }

  /**
   * Arbitrary relation graphs can be upserted (insert + update + delete)
   * using the upsertGraph method.
   * @param graph
   * @param options
   */
  upsertGraph(graph, options) {
    // Keep the input graph immutable
    const graphCloned = cloneDeep(graph);
    return this.model.query().upsertGraph(graphCloned, options);
  }

  /**
   *
   * @param {object} whereAttributes
   * @param {string} field
   * @param amount
   */
  changeNumber(whereAttributes, field: string, amount: number, trx) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    return this.model
      .query(trx)
      .where(whereAttributes)
      [changeMethod](field, Math.abs(amount));
  }
}
