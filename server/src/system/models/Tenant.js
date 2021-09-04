import moment from 'moment';
import { Model } from 'objection';
import uniqid from 'uniqid';
import SubscriptionPeriod from 'services/Subscription/SubscriptionPeriod';
import BaseModel from 'models/Model';
import TenantMetadata from './TenantMetadata';

export default class Tenant extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'tenants';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['isReady', 'isBuildRunning'];
  }

  /**
   * Tenant is ready.
   */
  get isReady() {
    return !!(this.initializedAt && this.seededAt);
  }

  /**
   * Detarimes the tenant whether is build currently running.
   */
  get isBuildRunning() {
    return !!this.buildJobId;
  }

  /**
   * Query modifiers.
   */
  static modifiers() {
    return {
      subscriptions(builder) {
        builder.withGraphFetched('subscriptions');
      },
    };
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const PlanSubscription = require('./Subscriptions/PlanSubscription');
    const TenantMetadata = require('./TenantMetadata');

    return {
      subscriptions: {
        relation: Model.HasManyRelation,
        modelClass: PlanSubscription.default,
        join: {
          from: 'tenants.id',
          to: 'subscription_plan_subscriptions.tenantId',
        },
      },
      metadata: {
        relation: Model.HasOneRelation,
        modelClass: TenantMetadata.default,
        join: {
          from: 'tenants.id',
          to: 'tenants_metadata.tenantId',
        },
      },
    };
  }

  /**
   * Retrieve the subscribed plans ids.
   * @return {number[]}
   */
  async subscribedPlansIds() {
    const { subscriptions } = this;
    return chain(subscriptions).map('planId').unq();
  }

  /**
   * Records a new subscription for the associated tenant.
   */
  newSubscription(subscriptionSlug, plan) {
    const trial = new SubscriptionPeriod(plan.trialInterval, plan.trialPeriod);
    const period = new SubscriptionPeriod(
      plan.invoiceInterval,
      plan.invoicePeriod,
      trial.getEndDate()
    );

    return this.$relatedQuery('subscriptions').insert({
      slug: subscriptionSlug,
      planId: plan.id,
      startsAt: period.getStartDate(),
      endsAt: period.getEndDate(),
    });
  }

  /**
   * Creates a new tenant with random organization id.
   */
  static createWithUniqueOrgId(uniqId) {
    const organizationId = uniqid() || uniqId;
    return this.query().insert({ organizationId });
  }

  /**
   * Mark as seeded.
   * @param {number} tenantId
   */
  static markAsSeeded(tenantId) {
    const seededAt = moment().toMySqlDateTime();
    return this.query().update({ seededAt }).where({ id: tenantId });
  }

  /**
   * Mark the the given organization as initialized.
   * @param {string} organizationId
   */
  static markAsInitialized(tenantId) {
    const initializedAt = moment().toMySqlDateTime();
    return this.query().update({ initializedAt }).where({ id: tenantId });
  }

  /**
   * Marks the given tenant as built.
   */
  static markAsBuilt(tenantId) {
    const builtAt = moment().toMySqlDateTime();
    return this.query().update({ builtAt }).where({ id: tenantId });
  }

  /**
   * Marks the given tenant as built.
   */
  static markAsBuilding(tenantId, buildJobId) {
    return this.query().update({ buildJobId }).where({ id: tenantId });
  }

  /**
   * Marks the given tenant as built.
   */
  static markAsBuildCompleted(tenantId) {
    return this.query().update({ buildJobId: null }).where({ id: tenantId });
  }

  /**
   * Saves the metadata of the given tenant.
   */
  static async saveMetadata(tenantId, metadata) {
    const foundMetadata = await TenantMetadata.query().findOne({ tenantId });
    const updateOrInsert = foundMetadata ? 'update' : 'insert';

    return TenantMetadata.query()
      [updateOrInsert]({
        tenantId,
        ...metadata,
      })
      .where({ tenantId });
  }

  /**
   * Saves the metadata of the tenant.
   */
  saveMetadata(metadata) {
    return Tenant.saveMetadata(this.id, metadata);
  }
}
