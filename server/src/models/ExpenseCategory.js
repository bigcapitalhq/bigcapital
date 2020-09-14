import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ExpenseCategory extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'expense_transaction_categories';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/Account');
    
    return {
      expenseAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'expense_transaction_categories.expenseAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
