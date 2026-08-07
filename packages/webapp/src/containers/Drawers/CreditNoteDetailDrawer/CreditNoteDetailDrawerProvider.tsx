import React from 'react';
import intl from 'react-intl-universal';
import type {
  CreditNote,
  CreditNoteRefundsResponse,
  AppliedCreditNoteInvoicesResponse,
  CreditNoteInvoicesToApplyResponse,
} from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import {
  useCreditNote,
  useRefundCreditNote,
  useReconcileCreditNote,
  useReconcileCreditNotes,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

export interface CreditNoteDetailDrawerContextValue {
  creditNoteId: number | undefined;
  creditNote: CreditNote | undefined;
  refundCreditNote: CreditNoteRefundsResponse | undefined;
  reconcileCreditNote: CreditNoteInvoicesToApplyResponse | undefined;
  reconcileCreditNotes: AppliedCreditNoteInvoicesResponse | undefined;
  isRefundCreditNoteLoading: boolean;
  isRefundCreditNoteFetching: boolean;
}

interface CreditNoteDetailDrawerProviderProps {
  creditNoteId: number | undefined;
}

const CreditNoteDetailDrawerContext = React.createContext<
  CreditNoteDetailDrawerContextValue | undefined
>(undefined);

/**
 * Credit note detail drawer provider.
 */
function CreditNoteDetailDrawerProvider({
  creditNoteId,
  ...props
}: CreditNoteDetailDrawerProviderProps & { children?: React.ReactNode }) {
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

  const provider: CreditNoteDetailDrawerContextValue = {
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
          number: creditNote?.creditNoteNumber,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('credit_note.drawer.subtitle', {
                value: creditNote?.branch?.name,
              })
            : null
        }
      />
      <CreditNoteDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCreditNoteDetailDrawerContext =
  (): CreditNoteDetailDrawerContextValue => {
    const ctx = React.useContext(CreditNoteDetailDrawerContext);
    if (ctx === undefined) {
      throw new Error(
        'useCreditNoteDetailDrawerContext must be used within a CreditNoteDetailDrawerProvider',
      );
    }
    return ctx;
  };

export { CreditNoteDetailDrawerProvider, useCreditNoteDetailDrawerContext };
