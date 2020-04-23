
export default class DynamicFilterAbstructor {
  constructor() {
    this.filterRoles = [];
    this.tableName = '';
  }

  setTableName(tableName) {
    this.tableName = tableName;
  }

  /**
   * @interface
   */
  // eslint-disable-next-line class-methods-use-this
  buildLogicExpression() {}

  /**
   * @interface
   */
  // eslint-disable-next-line class-methods-use-this
  validateFilterRoles() {}

  /**
   * @interface
   */
  // eslint-disable-next-line class-methods-use-this
  buildQuery() {}
}