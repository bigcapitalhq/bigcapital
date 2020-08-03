import { Model, mixin } from 'objection';
import moment from 'moment';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';


export default class Bill extends mixin(TenantModel, [CachableModel]) {
  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['dueAmount'];
  }

  /**
   * Table name
   */
  static get tableName() {
    return 'bills';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Due amount of the given.
   */
  get dueAmount() {
    return Math.max(this.balance - this.paymentAmount, 0);
  }
}
