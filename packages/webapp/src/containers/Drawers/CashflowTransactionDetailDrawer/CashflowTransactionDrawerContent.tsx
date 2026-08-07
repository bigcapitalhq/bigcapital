// @ts-nocheck
import React from 'react';

import '@/style/components/Drawers/CashflowTransactionDrawer.scss';

import { CashflowTransactionDrawerDetails } from './CashflowTransactionDrawerDetails';
import { CashflowTransactionDrawerProvider } from './CashflowTransactionDrawerProvider';
import { DrawerBody } from '@/components';

/**
 * Cash flow transction drawer content.
 */
export function CashflowTransactionDrawerContent({
  // #ownProp
  referenceId,
}) {
  return (
    <CashflowTransactionDrawerProvider referenceId={referenceId}>
      <DrawerBody>
        <CashflowTransactionDrawerDetails />
      </DrawerBody>
    </CashflowTransactionDrawerProvider>
  );
}
