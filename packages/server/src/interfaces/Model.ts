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
    | IModelMetaCollectionField
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

export interface IModelMetaFieldWithFields {
  fields: IModelMetaFieldCommon2 &
    (
      | IModelMetaFieldText
      | IModelMetaFieldNumber
      | IModelMetaFieldBoolean
      | IModelMetaFieldDate
      | IModelMetaFieldUrl
      | IModelMetaEnumerationField
      | IModelMetaRelationField
    );
}

interface IModelMetaCollectionObjectField extends IModelMetaFieldWithFields {
  collectionOf: 'object';
}

export interface IModelMetaCollectionFieldCommon {
  fieldType: 'collection';
  collectionMinLength?: number;
  collectionMaxLength?: number;
}

export type IModelMetaCollectionField = IModelMetaCollectionFieldCommon &
  IModelMetaCollectionObjectField;

export type IModelMetaRelationField = IModelMetaRelationFieldCommon &
  IModelMetaRelationEnumerationField;

interface IModelPrintMeta{
  pageTitle: string;
}

export interface IModelMeta {
  defaultFilterField: string;
  defaultSort: IModelMetaDefaultSort;

  exportable?: boolean;
  exportFlattenOn?: string;

  importable?: boolean;
  importAggregator?: string;
  importAggregateOn?: string;
  importAggregateBy?: string;

  print?: IModelPrintMeta;

  fields: { [key: string]: IModelMetaField };
  columns: { [key: string]: IModelMetaColumn };
}

// ----
export interface IModelMetaFieldCommon2 {
  name: string;
  required?: boolean;
  importHint?: string;
  order?: number;
  unique?: number;
}

export interface IModelMetaRelationField2 {
  fieldType: 'relation';
  relationModel: string;
  importableRelationLabel: string | string[];
}

export type IModelMetaField2 = IModelMetaFieldCommon2 &
  (
    | IModelMetaFieldText
    | IModelMetaFieldNumber
    | IModelMetaFieldBoolean
    | IModelMetaFieldDate
    | IModelMetaFieldUrl
    | IModelMetaEnumerationField
    | IModelMetaRelationField2
    | IModelMetaCollectionField
  );

export interface ImodelMetaColumnMeta {
  name: string;
  accessor?: string;
  exportable?: boolean;
}

interface IModelMetaColumnText {
  type: 'text;';
}

interface IModelMetaColumnCollection {
  type: 'collection';
  collectionOf: 'object';
  columns: { [key: string]: ImodelMetaColumnMeta & IModelMetaColumnText };
}

export type IModelMetaColumn = ImodelMetaColumnMeta &
  (IModelMetaColumnText | IModelMetaColumnCollection);
