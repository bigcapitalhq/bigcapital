import React from 'react';
import { DialogContent } from '@/components';
import { useSettingsCreditNotes } from '@/hooks/query';

interface CreditNoteNumberDialogContextValue {
  isSettingsLoading: boolean;
}

const CreditNoteNumberDialogContext =
  React.createContext<CreditNoteNumberDialogContextValue>(
    {} as CreditNoteNumberDialogContextValue,
  );

interface CreditNoteNumberDialogProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

/**
 *Credit Note number dialog provider
 */
function CreditNoteNumberDialogProvider({
  ...props
}: CreditNoteNumberDialogProviderProps) {
  const { isLoading: isSettingsLoading } = useSettingsCreditNotes();

  // Provider payload.
  const provider: CreditNoteNumberDialogContextValue = {
    isSettingsLoading,
  };

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <CreditNoteNumberDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useCreditNoteNumberDialogContext = () =>
  React.useContext(CreditNoteNumberDialogContext);

export { CreditNoteNumberDialogProvider, useCreditNoteNumberDialogContext };
