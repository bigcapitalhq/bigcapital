import SystemModel from '@/system/models/SystemModel';

export default class SubscriptionPlan extends SystemModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'subscriptions_plans';
  }
}
