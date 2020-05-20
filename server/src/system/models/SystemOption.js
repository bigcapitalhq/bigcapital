import { mixin } from 'objection';
import SystemModel from '@/system/models/SystemModel';
import MetableCollection from '@/lib/Metable/MetableCollection';

export default class Option extends SystemModel {
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
