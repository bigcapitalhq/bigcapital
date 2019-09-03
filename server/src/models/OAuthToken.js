import bookshelf from './bookshelf';

const OAuthToken = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'oauth_tokens',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,
});

export default bookshelf.model('OAuthToken', OAuthToken);
