import { IFilterRole, IDynamicFilter, IModel } from "interfaces";

export default class DynamicFilterAbstructor implements IDynamicFilter {
  filterRoles: IFilterRole[] = [];
  tableName: string;
  model: IModel;
  responseMeta: { [key: string]: any } = {};

  setModel(model: IModel) {
    this.model = model;
    this.tableName = model.tableName;
  }
}