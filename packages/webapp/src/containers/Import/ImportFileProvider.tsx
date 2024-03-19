// @ts-nocheck
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type EntityColumn = { key: string; name: string };
type SheetColumn = string;
type SheetMap = { from: string; to: string };

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
}
interface ImportFileProviderProps {
  resource: string;
  children: React.ReactNode;
}

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
  };

  return (
    <ImportFileContext.Provider value={value}>
      {children}
    </ImportFileContext.Provider>
  );
};
