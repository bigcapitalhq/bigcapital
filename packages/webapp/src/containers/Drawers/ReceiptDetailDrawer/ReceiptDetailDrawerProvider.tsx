import React from 'react';
import intl from 'react-intl-universal';
import type { SaleReceipt } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { useReceipt } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

export type ReceiptDetailEntry = SaleReceipt['entries'][number];
export type ReceiptDetail = SaleReceipt;

export interface ReceiptDetailDrawerContextValue {
  receiptId: number | undefined;
  receipt: ReceiptDetail | undefined;
}

interface ReceiptDetailDrawerProviderProps {
  receiptId: number | undefined;
}

const ReceiptDetailDrawerContext = React.createContext<
  ReceiptDetailDrawerContextValue | undefined
>(undefined);

/**
 * Receipt detail provider.
 */
function ReceiptDetailDrawerProvider({
  receiptId,
  ...props
}: ReceiptDetailDrawerProviderProps & { children?: React.ReactNode }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Fetch sale receipt details.
  const { isLoading: isReceiptLoading, data } = useReceipt(receiptId, {
    enabled: !!receiptId,
  });
  const receipt = data as ReceiptDetail | undefined;

  const provider: ReceiptDetailDrawerContextValue = {
    receiptId,
    receipt,
  };

  return (
    <DrawerLoading loading={isReceiptLoading}>
      <DrawerHeaderContent
        name={DRAWERS.RECEIPT_DETAILS}
        title={intl.get('receipt.drawer.title', {
          number: receipt?.receiptNumber,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('receipt.drawer.subtitle', {
                value: receipt?.branch?.name,
              })
            : null
        }
      />
      <ReceiptDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useReceiptDetailDrawerContext = (): ReceiptDetailDrawerContextValue => {
  const ctx = React.useContext(ReceiptDetailDrawerContext);
  if (ctx === undefined) {
    throw new Error(
      'useReceiptDetailDrawerContext must be used within a ReceiptDetailDrawerProvider',
    );
  }
  return ctx;
};

export { ReceiptDetailDrawerProvider, useReceiptDetailDrawerContext };
