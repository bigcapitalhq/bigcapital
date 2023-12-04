// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { useReceipt } from '@/hooks/query';
import { DRAWERS } from '@/constants/drawers';

// useTransactionsByReference
const ReceiptDetailDrawerContext = React.createContext();

/**
 * Receipt detail provider.
 */
function ReceiptDetailDrawerProvider({ receiptId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Fetch sale receipt details.
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(receiptId, {
    enabled: !!receiptId,
  });

  // Provider.
  const provider = {
    receiptId,
    receipt,
  };

  return (
    <DrawerLoading loading={isReceiptLoading}>
      <DrawerHeaderContent
        name={DRAWERS.RECEIPT_DETAILS}
        title={intl.get('receipt.drawer.title', {
          number: receipt.receipt_number,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('receipt.drawer.subtitle', {
                value: receipt.branch?.name,
              })
            : null
        }
      />
      <ReceiptDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}
const useReceiptDetailDrawerContext = () =>
  React.useContext(ReceiptDetailDrawerContext);

export { ReceiptDetailDrawerProvider, useReceiptDetailDrawerContext };
