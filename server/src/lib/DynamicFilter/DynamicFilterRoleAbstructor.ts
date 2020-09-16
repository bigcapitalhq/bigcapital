import { IFilterRole, IDynamicFilter } from "interfaces";

export default class DynamicFilterAbstructor implements IDynamicFilter {
  filterRoles: IFilterRole[] = [];
  tableName: string;

  setTableName(tableName) {
    this.tableName = tableName;
  }
}