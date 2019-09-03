import bookshelf from './bookshelf';

const ItemMetadata = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'items_metadata',

  /**
   * Timestamp columns.
   */
  hasTimestamps: ['created_at', 'updated_at'],

  /**
   * Item category may has many items.
   */
  items() {
    return this.belongsTo('Item', 'item_id');
  },
});

export default bookshelf.model('ItemMetadata', ItemMetadata);
