export interface IModel {
  name: string;
  tableName: string;
  fields: { [key: string]: any };
}

export interface IFilterMeta {
  sortOrder: string;
  sortBy: string;
}

export interface IPaginationMeta {
  pageSize: number;
  page: number;
}

export interface IModelMetaDefaultSort {
  sortOrder: ISortOrder;
  sortField: string;
}

export type IModelColumnType =
  | 'text'
  | 'number'
  | 'enumeration'
  | 'boolean'
  | 'relation';

export type ISortOrder = 'DESC' | 'ASC';

export interface IModelMetaFieldCommon {
  name: string;
  column: string;
  columnable?: boolean;
  customQuery?: Function;
  required?: boolean;
  importHint?: string;
  importableRelationLabel?: string;
  order?: number;
  unique?: number;
  dataTransferObjectKey?: string;
}

export interface IModelMetaFieldText {
  fieldType: 'text';
  minLength?: number;
  maxLength?: number;
}
export interface IModelMetaFieldBoolean {
  fieldType: 'boolean';
}
export interface IModelMetaFieldNumber {
  fieldType: 'number';
  min?: number;
  max?: number;
}
export interface IModelMetaFieldDate {
  fieldType: 'date';
}
export interface IModelMetaFieldUrl {
  fieldType: 'url';
}
export type IModelMetaField = IModelMetaFieldCommon &
  (
    | IModelMetaFieldText
    | IModelMetaFieldNumber
    | IModelMetaFieldBoolean
    | IModelMetaFieldDate
    | IModelMetaFieldUrl
    | IModelMetaEnumerationField
    | IModelMetaRelationField
  );

export interface IModelMetaEnumerationOption {
  key: string;
  label: string;
}

export interface IModelMetaEnumerationField {
  fieldType: 'enumeration';
  options: IModelMetaEnumerationOption[];
}

export interface IModelMetaRelationFieldCommon {
  fieldType: 'relation';
}

export interface IModelMetaRelationEnumerationField {
  relationType: 'enumeration';
  relationKey: string;
  relationEntityLabel: string;
  relationEntityKey: string;
}

export type IModelMetaRelationField = IModelMetaRelationFieldCommon &
  IModelMetaRelationEnumerationField;

export interface IModelMeta {
  defaultFilterField: string;
  defaultSort: IModelMetaDefaultSort;
  importable?: boolean;
  fields: { [key: string]: IModelMetaField };
}
