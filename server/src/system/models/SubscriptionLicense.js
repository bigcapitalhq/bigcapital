import { Model, mixin } from 'objection';
import SystemModel from '@/system/models/SystemModel';
import DateSession from '@/models/DateSession';
import UserSubscription from '@/services/Subscription/UserSubscription';


export default class SubscriptionLicense extends mixin(SystemModel, [DateSession, UserSubscription]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'subscription_licences';
  }

  markAsUsed() {
        
  }
}
