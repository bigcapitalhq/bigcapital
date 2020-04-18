

export default class DynamicFilterAbstructor {
  constructor() {
    this.filterRoles = [];
    this.tableName = '';
  }

  setTableName(tableName) {
    this.tableName = tableName;
  }

  buildLogicExpression() {}

  validateFilterRoles() {}

  buildQuery() {}
}