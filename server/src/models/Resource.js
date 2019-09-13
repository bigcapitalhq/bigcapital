import bookshelf from './bookshelf';

const Resource = bookshelf.Model.extend({
  /**
   * Table name.
   */
  tableName: 'resources',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  /**
   * Resource model may has many views.
   */
  views() {
    return this.hasMany('View', 'resource_id');
  },

  /**
   * Resource model may has many fields.
   */
  fields() {
    return this.hasMany('ResourceField', 'resource_id');
  },
});

export default bookshelf.model('Resource', Resource);
