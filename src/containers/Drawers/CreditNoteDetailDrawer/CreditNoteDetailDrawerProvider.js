import React from 'react';
import intl from 'react-intl-universal';
import { useCreditNote, useRefundCreditNote } from 'hooks/query';
import { DrawerHeaderContent, DrawerLoading } from 'components';

const CreditNoteDetailDrawerContext = React.createContext();

/**
 * Credit note detail drawer provider.
 */
function CreditNoteDetailDrawerProvider({ creditNoteId, ...props }) {
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

  const provider = {
    creditNote,
    refundCreditNote,
    isRefundCreditNoteLoading,
    isRefundCreditNoteFetching,
    creditNoteId,
  };

  return (
    <DrawerLoading loading={isCreditNoteLoading || isRefundCreditNoteLoading}>
      <DrawerHeaderContent
        name="credit-note-detail-drawer"
        title={intl.get('credit_note.drawer_credit_note_detail')}
      />
      <CreditNoteDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCreditNoteDetailDrawerContext = () =>
  React.useContext(CreditNoteDetailDrawerContext);

export { CreditNoteDetailDrawerProvider, useCreditNoteDetailDrawerContext };
