/* eslint-disable global-require */
import { mixin, Model } from 'objection';
import { castArray } from 'lodash';
import TenantModel from 'models/TenantModel';
import AccountTypesUtils from '@/lib/AccountTypes';
import CashflowAccountSettings from './CashflowAccount.Settings';
import ModelSettings from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Accounts/constants';
import ModelSearchable from './ModelSearchable';

export default class CashflowAccount extends mixin(TenantModel, [
  ModelSettings,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'accounts';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['accountTypeLabel'];
  }

  /**
   * Retrieve account type label.
   */
  get accountTypeLabel() {
    return AccountTypesUtils.getType(this.accountType, 'label');
  }

  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Inactive/Active mode.
       */
      inactiveMode(query, active = false) {
        query.where('accounts.active', !active);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const AccountTransaction = require('models/AccountTransaction');

    return {
      /**
       * Account model may has many transactions.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'accounts.id',
          to: 'accounts_transactions.accountId',
        },
      },
    };
  }

  /**
   * Determines whether the given type equals the account type.
   * @param {string} accountType
   * @return {boolean}
   */
  isAccountType(accountType) {
    const types = castArray(accountType);
    return types.indexOf(this.accountType) !== -1;
  }

  /**
   * Determine whether the given parent type equals the account type.
   * @param {string} parentType
   * @return {boolean}
   */
  isParentType(parentType) {
    return AccountTypesUtils.isParentTypeEqualsKey(
      this.accountType,
      parentType
    );
  }

  /**
   * Model settings.
   */
  static get meta() {
    return CashflowAccountSettings;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }

  /**
   * Model search roles.
   */
  static get searchRoles() {
    return [
      { condition: 'or', fieldKey: 'name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'code', comparator: 'like' },
    ];
  }
}
