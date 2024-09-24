import React, { createContext, useContext, ReactNode } from 'react';

const DialogContext = createContext<any>(null);

export const useDialogContext = () => {
  return useContext(DialogContext);
};

interface DialogProviderProps {
  value: any;
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ value, children }) => {
  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
};
