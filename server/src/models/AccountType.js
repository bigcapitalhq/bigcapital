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
      other_current_asset: 'Other Current Asset',
      bank: 'Bank Account',
      cash: 'Cash',
      fixed_asset: 'Fixed Asset',
      non_current_asset: 'Non-Current Asset',
      accounts_payable: 'Accounts Payable (A/P)',
      accounts_receivable: 'Accounts Receivable (A/R)',
      credit_card: 'Credit Card',
      long_term_liability: 'Long Term Liability',
      other_current_liability: 'Other Current Liability',
      other_liability: 'Other Liability',
      equity: "Equity",
      expense: "Expense",
      income: "Income",
      other_income: "Other Income",
      other_expense: "Other Expense",
      cost_of_goods_sold: "Cost of Goods Sold (COGS)",
    };
  }
}
