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
      fixed_asset: 'Fixed asset',
      current_asset: "Current asset",
      long_term_liability: "Long term liability",
      current_liability: "Current liability",
      equity: "Equity",
      expense: "Expense",
      income: "Income",
      accounts_receivable: "Accounts receivable",
      accounts_payable: "Accounts payable",
      other_expense: "Other expense",
      other_income: "Other income",
      cost_of_goods_sold: "Cost of goods sold (COGS)",
      other_liability: "Other liability",
      other_asset: 'Other asset',
    };
  }
}
