

export interface IResource {
  id: number,
  key: string,
}

export interface IResourceField {
  labelName: string,
  key: string,
  dataType: string,
  helpText?: string | null,
  default?: string,
  predefined: boolean,
  active: boolean,
  builtin: boolean,
  columnable: boolean,
  index: number,
  dataResource: string,
  resourceId: number,
  options: any;
}