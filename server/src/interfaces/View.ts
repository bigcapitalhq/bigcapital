
export interface IView {
  id: number,
  name: string,
  predefined: boolean,
  resourceId: number,
  favourite: boolean,
  rolesLogicRxpression: string,
};

export interface IViewRole {
  id: number,
  fieldId: number,
  index: number, 
  comparator: string,
  value: string,
  viewId: number,
};

export interface IViewHasColumn {
  viewId: number,
  fieldId: number,
  index: number,
}