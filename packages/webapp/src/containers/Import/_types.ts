export enum ImportStepperStep {
  Upload = 0,
  Mapping = 1,
  Preview = 2,
}

export enum ImportAlert {
  IMPORTED_SHEET_EMPTY = 'IMPORTED_SHEET_EMPTY',
}

export interface ImportFileMappingFormProps {
  children: React.ReactNode;
}

export type ImportFileMappingFormValues = Record<string, string | null>;
