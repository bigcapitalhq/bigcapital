import { Model, mixin } from 'objection';
import moment from 'moment';
import SystemModel from '@/system/models/SystemModel';

export default class License extends SystemModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'subscription_licenses';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      // Filters active licenses.
      filterActiveLicense(query) {
        query.where('disabled_at', null);
        query.where('used_at', null);
      },

      // Find license by its code or id.
      findByCodeOrId(query, id, code) {
        if (id) {
          query.where('id', id);
        }
        if (code) {
          query.where('license_code', code);
        }
      },

      // Filters licenses list.
      filter(builder, licensesFilter) {
        if (licensesFilter.active) {
          builder.modify('filterActiveLicense');
        }
        if (licensesFilter.disabled) {
          builder.whereNot('disabled_at', null);
        }
        if (licensesFilter.used) {
          builder.whereNot('used_at', null);
        }
        if (licensesFilter.sent) {
          builder.whereNot('sent_at', null);
        }
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Plan = require('system/models/Subscriptions/Plan');

    return {
      plan: {
        relation: Model.BelongsToOneRelation,
        modelClass: Plan.default,
        join: {
          from: 'subscription_licenses.planId',
          to: 'subscriptions_plans.id',
        },
      },
    };
  }

  /**
   * Deletes the given license code from the storage.
   * @param {string} licenseCode
   * @return {Promise}
   */
  static deleteLicense(licenseCode, viaAttribute = 'license_code') {
    return this.query().where(viaAttribute, licenseCode).delete();
  }

  /**
   * Marks the given license code as disabled on the storage.
   * @param {string} licenseCode
   * @return {Promise}
   */
  static markLicenseAsDisabled(licenseCode, viaAttribute = 'license_code') {
    return this.query().where(viaAttribute, licenseCode).patch({
      disabled_at: moment().toMySqlDateTime(),
    });
  }

  /**
   * Marks the given license code as sent on the storage.
   * @param {string} licenseCode
   */
  static markLicenseAsSent(licenseCode, viaAttribute = 'license_code') {
    return this.query().where(viaAttribute, licenseCode).patch({
      sent_at: moment().toMySqlDateTime(),
    });
  }

  /**
   * Marks the given license code as used on the storage.
   * @param {string} licenseCode
   * @return {Promise}
   */
  static markLicenseAsUsed(licenseCode, viaAttribute = 'license_code') {
    return this.query().where(viaAttribute, licenseCode).patch({
      used_at: moment().toMySqlDateTime(),
    });
  }

  /**
   *
   * @param {IIPlan} plan
   * @return {boolean}
   */
  isEqualPlanPeriod(plan) {
    return (
      this.invoicePeriod === plan.invoiceInterval &&
      license.licensePeriod === license.periodInterval
    );
  }
}
