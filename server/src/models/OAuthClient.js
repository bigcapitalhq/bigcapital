import bookshelf from './bookshelf';

const OAuthClient = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'oauth_clients',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,
});

export default bookshelf.model('OAuthClient', OAuthClient);
