import bookshelf from './bookshelf';

const AccountType = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'accounts',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  /**
   * Account type may has many associated accounts.
   */
  accounts() {
    return this.hasMany('Account', 'account_type_id');
  },
});

export default bookshelf.model('AccountType', AccountType);
