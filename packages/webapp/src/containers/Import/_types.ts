import type {
  ImportFileMetaResponse,
  ImportPreviewResponse,
} from '@bigcapital/sdk-ts';
import type { ReactNode } from 'react';

export enum ImportStepperStep {
  Upload = 0,
  Mapping = 1,
  Preview = 2,
}

export enum ImportAlert {
  IMPORTED_SHEET_EMPTY = 'IMPORTED_SHEET_EMPTY',
}

export type ImportFileFormat = 'csv' | 'xlsx';

export interface ImportFileMappingFormProps {
  children: ReactNode;
}

export type ImportFileMappingFormValues = Record<string, string | null>;

export interface ImportFileUploadValues {
  file: File | null;
}

export interface ImportViewProps {
  resource: string;
  description?: string;
  params?: Record<string, unknown>;
  onImportSuccess?: () => void;
  onImportFailed?: () => void;
  onCancelClick?: () => void;
  sampleFileName?: string;
  exampleDownload?: boolean;
  exampleTitle?: string;
  exampleDescription?: string;
}

export interface ImportPreviewError {
  rowNumber: number;
  uniqueValue: string;
  errorMessage: string;
}

export interface ImportPreview extends ImportPreviewResponse {
  createdCount: number;
  totalCount: number;
  skippedCount: number;
  errorsCount: number;
  errors: ImportPreviewError[];
  unmappedColumns?: string[];
  unmappedColumnsCount: number;
}

export interface ImportFileMetaMap {
  from: string;
  to: string;
  group?: string;
}

export interface ImportFileMeta extends ImportFileMetaResponse {
  map?: ImportFileMetaMap[];
}
