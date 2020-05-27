import SystemModel from '@/system/models/SystemModel';

export default class SubscriptionUsage extends SystemModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'subscriptions_usage';
  }
}
