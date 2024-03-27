import { Spinner } from '@blueprintjs/core';
import React, { createContext, useContext } from 'react';
import { Box } from '@/components';
import { useImportFileMeta } from '@/hooks/query/import';

interface ImportFileMapBootContextValue {}

const ImportFileMapBootContext = createContext<ImportFileMapBootContextValue>(
  {} as ImportFileMapBootContextValue,
);

export const useImportFileMapBootContext = () => {
  const context = useContext<ImportFileMapBootContextValue>(
    ImportFileMapBootContext,
  );

  if (!context) {
    throw new Error(
      'useImportFileMapBootContext must be used within an ImportFileMapBootProvider',
    );
  }
  return context;
};

interface ImportFileMapBootProps {
  importId: string;
  children: React.ReactNode;
}

export const ImportFileMapBootProvider = ({
  importId,
  children,
}: ImportFileMapBootProps) => {
  const {
    data: importFile,
    isLoading: isImportFileLoading,
    isFetching: isImportFileFetching,
  } = useImportFileMeta(importId, {
    enabled: Boolean(importId),
  });

  const value = {
    importFile,
    isImportFileLoading,
    isImportFileFetching,
  };
  return (
    <ImportFileMapBootContext.Provider value={value}>
      {isImportFileLoading ? (
        <Box style={{ padding: '2rem', textAlign: 'center' }}>
          <Spinner size={26} />
        </Box>
      ) : (
        <>{children}</>
      )}
    </ImportFileMapBootContext.Provider>
  );
};
