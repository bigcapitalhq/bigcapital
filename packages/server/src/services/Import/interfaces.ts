import { IModelMetaField } from '@/interfaces';

export interface ImportMappingAttr {
  from: string;
  to: string;
}

export interface ImportValidationError {
  index: number;
  property: string;
  constraints: Record<string, string>;
}

export type ResourceMetaFieldsMap = { [key: string]: IModelMetaField };

export interface ImportInsertError {
  rowNumber: number;
  errorCode: string;
  errorMessage: string;
}
