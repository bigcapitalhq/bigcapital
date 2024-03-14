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

export interface ImportFileUploadPOJO {
  import: {
    importId: string;
    resource: string;
  };
  sheetColumns: string[];
  resourceColumns: { key: string; name: string }[];
}

export interface ImportFileMapPOJO {
  import: {
    importId: string;
    resource: string;
  };
}

export interface ImportFilePreviewPOJO {
  createdCount: number;
  skippedCount: number;
  totalCount: number;
  errorsCount: number;
  errors: ImportInsertError[];
  unmappedColumns: string[];
  unmappedColumnsCount: number;
}


export interface ImportOperSuccess {
  data: unknown;
  index: number;
}

export interface ImportOperError {
  error: ImportInsertError;
  index: number;
}