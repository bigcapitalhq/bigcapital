import bookshelf from './bookshelf';

const AccountBalance = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'account_balance',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  /**
   * 
   */
  account() {
    return this.belongsTo('Account', 'account_id');
  },
});

export default bookshelf.model('AccountBalance', AccountBalance);
