import bookshelf from './bookshelf';

const Account = bookshelf.Model.extend({
  /**
   * Table name
   */
  tableName: 'accounts',

  /**
   * Timestamp columns.
   */
  hasTimestamps: ['created_at', 'updated_at'],

  /**
   * Account model may belongs to account type.
   */
  type() {
    return this.belongsTo('AccountType', 'account_type_id');
  },

  balances() {
    return this.hasMany('AccountBalance', 'accounnt_id');
  },
}, {
  /**
   * Cascade delete dependents.
   */
  dependents: ['balances'],
});

export default bookshelf.model('Account', Account);
