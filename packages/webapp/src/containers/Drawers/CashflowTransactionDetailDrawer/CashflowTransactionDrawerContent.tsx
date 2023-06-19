// @ts-nocheck
import React from 'react';

import '@/style/components/Drawers/CashflowTransactionDrawer.scss';

import { DrawerBody } from '@/components';
import { CashflowTransactionDrawerProvider } from './CashflowTransactionDrawerProvider';
import CashflowTransactionDrawerDetails from './CashflowTransactionDrawerDetails';

/**
 * Cash flow transaction drawer content.
 */
export default function CashflowTransactionDrawerContent({
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
