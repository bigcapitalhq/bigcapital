// import path from 'path';
import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';

export default class AccountType extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'account_types';
  }

  /**
   * Virtaul attributes.
   */
  static get virtualAttributes() {
    return ['label'];
  }

  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Translatable lable.
   */
  label() {
    return AccountType.labels[this.key] || '';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/Account');

    return {
      /**
       * Account type may has many associated accounts.
       */
      accounts: {
        relation: Model.HasManyRelation,
        modelClass: Account.default,
        join: {
          from: 'account_types.id',
          to: 'accounts.accountTypeId',
        },
      },
    };
  }

  /**
   * Accounts types labels.
   */
  static get labels() {
    return {
      inventory: 'Inventory',
      other_current_asset: 'Other current asset',
      bank: 'Bank account',
      cash: 'Cash',
      fixed_asset: 'Fixed asset',
      non_current_asset: 'Non-current asset',
      accounts_payable: 'Accounts payable (A/P)',
      accounts_receivable: 'Accounts receivable (A/R)',
      credit_card: 'Credit card',
      long_term_liability: 'Long term liability',
      other_current_liability: 'Other current liability',
      other_liability: 'Other liability',
      equity: "Equity",
      expense: "Expense",
      income: "Income",
      other_income: "Other income",
      other_expense: "Other expense",
      cost_of_goods_sold: "Cost of goods sold (COGS)",
    };
  }
}
