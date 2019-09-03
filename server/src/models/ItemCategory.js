import bookshelf from './bookshelf';

const ItemCategory = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'items_categories',

  /**
   * Timestamp columns.
   */
  hasTimestamps: ['created_at', 'updated_at'],

  /**
   * Item category may has many items.
   */
  items() {
    return this.hasMany('Item', 'category_id');
  },
});

export default bookshelf.model('ItemCategory', ItemCategory);
