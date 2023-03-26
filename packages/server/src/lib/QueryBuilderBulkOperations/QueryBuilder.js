import { QueryBuilder } from "knex"
import { QueryBuilder } from 'objection';

export default class BulkOperationsQueryBuilder extends QueryBuilder {

  bulkInsert(collection) {
    const opers = [];

    collection.forEach((dataset) => {
      const insertOper = this.insert({ ...dataset });
      opers.push(insertOper);
    });
    return Promise.all(opers);
  }

  bulkDelete(rowsIds) {

  }

  bulkUpdate(dataset, whereColumn) {

  }

  bulkPatch(newDataset, oldDataset) {

  }
}