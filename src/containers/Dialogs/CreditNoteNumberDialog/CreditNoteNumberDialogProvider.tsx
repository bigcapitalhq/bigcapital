// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { useSettingsCreditNotes } from '@/hooks/query';

const CreditNoteNumberDialogContext = React.createContext();

/**
 *Credit Note number dialog provider
 */
function CreditNoteNumberDialogProvider({ query, ...props }) {
  const { isLoading: isSettingsLoading } = useSettingsCreditNotes();

  // Provider payload.
  const provider = {
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
