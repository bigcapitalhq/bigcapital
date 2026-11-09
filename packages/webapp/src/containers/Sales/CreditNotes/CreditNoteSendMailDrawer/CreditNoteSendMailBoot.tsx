import { type CreditNoteMailStateResponse } from '@bigcapital/sdk-ts';
import { Spinner } from '@blueprintjs/core';
import React, { createContext, useContext } from 'react';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useCreditNoteMailState } from '@/hooks/query';

interface CreditNoteSendMailBootValues {
  creditNoteId: number;

  creditNoteMailState: CreditNoteMailStateResponse | undefined;
  isCreditNoteMailState: boolean;
}
interface CreditNoteSendMailBootProps {
  children: React.ReactNode;
}

const CreditNoteSendMailContentBootContext =
  createContext<CreditNoteSendMailBootValues>(
    {} as CreditNoteSendMailBootValues,
  );

export const CreditNoteSendMailBoot = ({
  children,
}: CreditNoteSendMailBootProps) => {
  const {
    payload: { creditNoteId },
  } = useDrawerContext();

  // Credit note mail options.
  const { data: creditNoteMailState, isLoading: isCreditNoteMailState } =
    useCreditNoteMailState(creditNoteId);

  const isLoading = isCreditNoteMailState;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {
    creditNoteId,

    // # Credit note mail options
    isCreditNoteMailState,
    creditNoteMailState,
  };

  return (
    <CreditNoteSendMailContentBootContext.Provider value={value}>
      {children}
    </CreditNoteSendMailContentBootContext.Provider>
  );
};
CreditNoteSendMailBoot.displayName = 'CreditNoteSendMailBoot';

export const useCreditNoteSendMailBoot = () => {
  return useContext<CreditNoteSendMailBootValues>(
    CreditNoteSendMailContentBootContext,
  );
};
