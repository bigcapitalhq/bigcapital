// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  useCreditNote,
  useRefundCreditNote,
  useReconcileCreditNote,
  useReconcileCreditNotes,
} from '@/hooks/query';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';

const CreditNoteDetailDrawerContext = React.createContext();

/**
 * Credit note detail drawer provider.
 */
function CreditNoteDetailDrawerProvider({ creditNoteId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  
  // Handle fetch vendor credit details.
  const { data: creditNote, isLoading: isCreditNoteLoading } = useCreditNote(
    creditNoteId,
    {
      enabled: !!creditNoteId,
    },
  );

  // Handle fetch refund credit note.
  const {
    data: refundCreditNote,
    isFetching: isRefundCreditNoteFetching,
    isLoading: isRefundCreditNoteLoading,
  } = useRefundCreditNote(creditNoteId, {
    enabled: !!creditNoteId,
  });

  // Handle fetch refund credit note.
  const {
    data: reconcileCreditNotes,
    isLoading: isReconcileCreditNoteLoading,
  } = useReconcileCreditNotes(creditNoteId, {
    enabled: !!creditNoteId,
  });

  // Handle fetch reconcile credit note details.
  const { isLoading: isReconcileCreditLoading, data: reconcileCreditNote } =
    useReconcileCreditNote(creditNoteId, {
      enabled: !!creditNoteId,
    });

  const provider = {
    creditNote,
    refundCreditNote,
    reconcileCreditNote,
    reconcileCreditNotes,

    isRefundCreditNoteLoading,
    isRefundCreditNoteFetching,
    creditNoteId,
  };

  return (
    <DrawerLoading
      loading={
        isCreditNoteLoading ||
        isRefundCreditNoteLoading ||
        isReconcileCreditNoteLoading ||
        isReconcileCreditLoading
      }
    >
      <DrawerHeaderContent
        name={DRAWERS.CREDIT_NOTE_DETAILS}
        title={intl.get('credit_note.drawer.title', {
          number: creditNote.credit_note_number,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('credit_note.drawer.subtitle', {
                value: creditNote.branch?.name,
              })
            : null
        }
      />
      <CreditNoteDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCreditNoteDetailDrawerContext = () =>
  React.useContext(CreditNoteDetailDrawerContext);

export { CreditNoteDetailDrawerProvider, useCreditNoteDetailDrawerContext };
