import bookshelf from './bookshelf';
import Metable from './Metable';
import Auth from './Auth';

const Setting = bookshelf.Model.extend({
  /**
   * Table name
   */
  tableName: 'settings',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  /**
   * Extra metadata query to query with the current authenticate user.
   * @param {Object} query
   */
  extraMetadataQuery(query) {
    if (Auth.isLogged()) {
      query.where('user_id', Auth.userId());
    }
  },
}, {
  /**
   * Table name
   */
  tableName: 'settings',

  ...Metable,
});

export default bookshelf.model('Setting', Setting);
