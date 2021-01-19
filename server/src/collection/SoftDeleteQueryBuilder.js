import moment from 'moment';
import { Model } from 'objection';

const options = {
  columnName: 'deleted_at',
  deletedValue: moment().format('YYYY-MM-DD HH:mm:ss'),
  notDeletedValue: null,
};

export default class SoftDeleteQueryBuilder extends Model.QueryBuilder {
  constructor(...args) {
    super(...args);

    this.onBuild((builder) => {
      if (builder.isFind() || builder.isDelete() || builder.isUpdate()) {
        builder.whereNotDeleted();
      }
    });
  }

  /**
   * override the normal delete function with one that patches the row's "deleted" column
   */
  delete() {
    this.context({
      softDelete: true,
    });
    const patch = {};
    patch[options.columnName] = options.deletedValue;
    return this.patch(patch);
  }

  /**
   * Provide a way to actually delete the row if necessary
   */
  hardDelete() {
    return super.delete();
  }

  /**
   * Provide a way to undo the delete
   */
  undelete() {
    this.context({
      undelete: true,
    });
    const patch = {};
    patch[options.columnName] = options.notDeletedValue;
    return this.patch(patch);
  }

  /**
   * Provide a way to filter to ONLY deleted records without having to remember the column name
   */
  whereDeleted() {
    const prefix = this.modelClass().tableName;

    // this if is for backwards compatibility, to protect those that used a nullable `deleted` field
    if (options.deletedValue === true) {
      return this.where(`${prefix}.${options.columnName}`, options.deletedValue);
    }
    // qualify the column name
    return this.whereNot(`${prefix}.${options.columnName}`, options.notDeletedValue);
  }

  // provide a way to filter out deleted records without having to remember the column name
  whereNotDeleted() {
    const prefix = this.modelClass().tableName;

    // qualify the column name
    return this.where(`${prefix}.${options.columnName}`, options.notDeletedValue);
  }
}  
