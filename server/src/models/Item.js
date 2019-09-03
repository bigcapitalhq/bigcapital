import bookshelf from './bookshelf';

const Item = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'items',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  /**
   * Item may has many meta data.
   */
  metadata() {
    return this.hasMany('ItemMetadata', 'item_id');
  },

  /**
   * Item may belongs to the item category.
   */
  category() {
    return this.belongsTo('ItemCategory', 'category_id');
  },
});

export default bookshelf.model('Item', Item);
