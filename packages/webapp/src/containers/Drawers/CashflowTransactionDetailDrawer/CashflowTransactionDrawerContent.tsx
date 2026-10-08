import React from 'react';
import '@/style/components/Drawers/CashflowTransactionDrawer.scss';
import { CashflowTransactionDrawerDetails } from './CashflowTransactionDrawerDetails';
import { CashflowTransactionDrawerProvider } from './CashflowTransactionDrawerProvider';
import { DrawerBody } from '@/components';

interface CashflowTransactionDrawerContentProps {
  referenceId?: number | null;
}

/**
 * Cash flow transction drawer content.
 */
export function CashflowTransactionDrawerContent({
  // #ownProp
  referenceId,
}: CashflowTransactionDrawerContentProps) {
  return (
    <CashflowTransactionDrawerProvider referenceId={referenceId}>
      <DrawerBody>
        <CashflowTransactionDrawerDetails />
      </DrawerBody>
    </CashflowTransactionDrawerProvider>
  );
}
