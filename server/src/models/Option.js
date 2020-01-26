import { mixin } from 'objection';
import BaseModel from '@/models/Model';
import MetableCollection from '@/lib/Metable/MetableCollection';

export default class Option extends mixin(BaseModel, [mixin]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'options';
  }

  /**
   * Override the model query.
   * @param  {...any} args -
   */
  static query(...args) {
    return super.query(...args).runAfter((result) => {
      if (result instanceof MetableCollection) {
        result.setModel(Option);
      }
      return result;
    });
  }

  static get collection() {
    return MetableCollection;
  }
}
