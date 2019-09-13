import { snakeCase } from 'lodash';
import bookshelf from './bookshelf';

const ResourceField = bookshelf.Model.extend({
  /**
   * Table name.
   */
  tableName: 'resource_fields',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  virtuals: {
    /**
     * Resource field key.
     */
    key() {
      return snakeCase(this.attributes.label_name);
    },
  },

  /**
   * Resource field may belongs to resource model.
   */
  resource() {
    return this.belongsTo('Resource', 'resource_id');
  },
}, {
  /**
   * JSON Columns.
   */
  jsonColumns: ['options'],
});

export default bookshelf.model('ResourceField', ResourceField);
