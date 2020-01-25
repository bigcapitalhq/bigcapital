import { Model } from 'objection';

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
}
