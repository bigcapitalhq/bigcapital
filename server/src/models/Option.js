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

  static get collection() {
    return MetableCollection;
  }
}
