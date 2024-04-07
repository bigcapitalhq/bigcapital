// @ts-nocheck
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export type EntityColumnField = {
  key: string;
  name: string;
  required?: boolean;
  hint?: string;
  group?: string;
};

export interface EntityColumn {
  groupKey: string;
  groupLabel: string;
  fields: EntityColumnField[];
}
export type SheetColumn = string;
export type SheetMap = { from: string; to: string };

interface ImportFileContextValue {
  sheetColumns: SheetColumn[];
  setSheetColumns: Dispatch<SetStateAction<SheetColumn[]>>;

  entityColumns: EntityColumn[];
  setEntityColumns: Dispatch<SetStateAction<EntityColumn[]>>;

  sheetMapping: SheetMap[];
  setSheetMapping: Dispatch<SetStateAction<SheetMap[]>>;

  step: number;
  setStep: Dispatch<SetStateAction<number>>;

  importId: string;
  setImportId: Dispatch<SetStateAction<string>>;

  resource: string;
  description?: string;
  params: Record<string, any>;
  onImportSuccess?: () => void;
  onImportFailed?: () => void;
  onCancelClick?: () => void;
  sampleFileName?: string;

  exampleDownload?: boolean;
  exampleTitle?: string;
  exampleDescription?: string;
}
interface ImportFileProviderProps {
  resource: string;
  description?: string;
  params: Record<string, any>;
  onImportSuccess?: () => void;
  onImportFailed?: () => void;
  onCancelClick?: () => void;
  children: React.ReactNode;
  sampleFileName?: string;

  exampleDownload?: boolean;
  exampleTitle?: string;
  exampleDescription?: string;
}

const ExampleDescription =
  'You can download the sample file to obtain detailed information about the data fields used during the import.';
const ExampleTitle = 'Table Example';

const ImportFileContext = createContext<ImportFileContextValue>(
  {} as ImportFileContextValue,
);

export const useImportFileContext = () => {
  const context = useContext<ImportFileContextValue>(ImportFileContext);

  if (!context) {
    throw new Error(
      'useImportFileContext must be used within an ImportFileProvider',
    );
  }
  return context;
};

export const ImportFileProvider = ({
  resource,
  children,
  description,
  params,
  onImportFailed,
  onImportSuccess,
  onCancelClick,
  sampleFileName,

  exampleDownload = true,
  exampleTitle = ExampleTitle,
  exampleDescription = ExampleDescription,
}: ImportFileProviderProps) => {
  const [sheetColumns, setSheetColumns] = useState<SheetColumn[]>([]);
  const [entityColumns, setEntityColumns] = useState<SheetColumn[]>([]);
  const [sheetMapping, setSheetMapping] = useState<SheetMap[]>([]);
  const [importId, setImportId] = useState<string>('');

  const [step, setStep] = useState<number>(0);

  const value = {
    sheetColumns,
    setSheetColumns,

    entityColumns,
    setEntityColumns,

    sheetMapping,
    setSheetMapping,

    step,
    setStep,

    importId,
    setImportId,

    resource,
    description,
    params,

    onImportSuccess,
    onImportFailed,
    onCancelClick,

    sampleFileName,

    exampleDownload,
    exampleTitle,
    exampleDescription,
  };

  return (
    <ImportFileContext.Provider value={value}>
      {children}
    </ImportFileContext.Provider>
  );
};
