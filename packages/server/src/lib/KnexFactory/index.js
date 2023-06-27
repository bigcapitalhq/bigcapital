const { extend, isFunction, isObject } = require('lodash');

export default class KnexFactory {

  constructor(knex) {
    this.knex = knex;

    this.factories = [];
  }

  define(name, tableName, defaultAttributes) {
    this.factories[name] = { tableName, defaultAttributes };
  }

  async build(factoryName, attributes) {
    const factory = this.factories[factoryName];

    if (!factory) {
      throw `Unknown factory: ${factoryName}`;
    }
    let { defaultAttributes } = factory;
    const insertData = {};
    
    if( 'function' === typeof defaultAttributes) {
      defaultAttributes = await defaultAttributes();
    }
    extend(insertData, defaultAttributes, attributes);

    for (let k in insertData) {
      const v = insertData[k];

      if (isFunction(v)) {
        insertData[k] = await v();
      } else {
        insertData[k] = await v;
      }
      if (isObject(insertData[k]) && insertData[k].id) {
        insertData[k] = insertData[k].id;
      }
    };

    return insertData;
  }

  async create(factoryName, attributes) {
    const factory = this.factories[factoryName];
    const insertData = await this.build(factoryName, attributes);
    const { tableName } = factory;

    const [id] = await this.knex(tableName).insert(insertData);
    const record = await this.knex(tableName).where({ id }).first();

    return record;
  }
}