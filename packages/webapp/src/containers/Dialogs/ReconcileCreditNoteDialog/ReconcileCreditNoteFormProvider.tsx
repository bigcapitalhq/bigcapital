import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type {
  ReconcileCreditNote,
  ReconcileCreditNoteContextValue,
  ReconcileCreditNoteFormEntry,
} from './types';
import { DialogContent } from '@/components';
import {
  useCreateReconcileCreditNote,
  useCreditNote,
  useReconcileCreditNote,
} from '@/hooks/query';

const ReconcileCreditNoteDialogContext =
  createContext<ReconcileCreditNoteContextValue>(
    {} as ReconcileCreditNoteContextValue,
  );

interface ReconcileCreditNoteFormProviderProps {
  creditNoteId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Reconcile credit note provider.
 */
function ReconcileCreditNoteFormProvider({
  creditNoteId,
  dialogName,
  ...props
}: ReconcileCreditNoteFormProviderProps) {
  // Handle fetch reconcile credit note details.
  // `useReconcileCreditNote` returns `unknown` from the SDK; cast narrow.
  const { isLoading: isReconcileCreditLoading, data: reconcileCreditNotesRaw } =
    useReconcileCreditNote(creditNoteId, {
      enabled: !!creditNoteId,
    });
  const reconcileCreditNotes =
    (reconcileCreditNotesRaw as ReconcileCreditNoteFormEntry[] | undefined) ??
    [];

  // Handle fetch credit note details.
  const { data: creditNote, isLoading: isCreditNoteLoading } = useCreditNote(
    creditNoteId,
    {
      enabled: !!creditNoteId,
    },
  );

  // Create reconcile credit note mutations.
  const { mutateAsync: createReconcileCreditNoteMutate } =
    useCreateReconcileCreditNote();

  // Detarmines the datatable empty status.
  const isEmptyStatus = isEmpty(reconcileCreditNotes);

  // provider payload.
  const provider: ReconcileCreditNoteContextValue = {
    dialogName,
    reconcileCreditNotes,
    createReconcileCreditNoteMutate,
    isEmptyStatus,
    creditNote: creditNote as ReconcileCreditNote | undefined,
    creditNoteId: creditNoteId ?? null,
  };

  return (
    <DialogContent
      isLoading={isReconcileCreditLoading || isCreditNoteLoading}
      name={'reconcile-credit-note'}
    >
      <ReconcileCreditNoteDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useReconcileCreditNoteContext = () =>
  React.useContext(ReconcileCreditNoteDialogContext);

export { ReconcileCreditNoteFormProvider, useReconcileCreditNoteContext };
