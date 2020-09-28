
export interface IView {
  id: number,
  name: string,
  predefined: boolean,
  resourceModel: string,
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
  id :number,
  viewId: number,
  fieldId: number,
  index: number,
}

export interface IViewRoleDTO {
  index: number,
  fieldKey: string,
  comparator: string,
  value: string,
  viewId: number,
}

export interface IViewColumnDTO {
  id: number,
  index: number,
  viewId: number,
  fieldKey: string,
};

export interface IViewDTO {
  name: string,
  logicExpression: string,
  roles: IViewRoleDTO[],
  columns: IViewColumnDTO[],
};

export interface IViewEditDTO {
  name: string,
  logicExpression: string,
  roles: IViewRoleDTO[],
  columns: IViewColumnDTO[],
};

export interface IViewsService {
  listViews(tenantId: number, resourceModel: string): Promise<void>;
  newView(tenantId: number, viewDTO: IViewDTO): Promise<void>;
  editView(tenantId: number, viewId: number, viewEditDTO: IViewEditDTO): Promise<void>;
  deleteView(tenantId: number, viewId: number): Promise<void>;
}