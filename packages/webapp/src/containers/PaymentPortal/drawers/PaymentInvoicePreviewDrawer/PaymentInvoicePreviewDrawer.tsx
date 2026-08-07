// @ts-nocheck
import { Position } from '@blueprintjs/core';
import * as R from 'ramda';
import React from 'react';
import { PaymentInvoicePreviewContent } from './PaymentInvoicePreviewContent';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

/**
 *
 * @returns {React.ReactNode}
 */
function PaymentInvoicePreviewDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'100%'}
      style={{ background: '#F6F7F9' }}
      position={Position.TOP}
      payload={payload}
    >
      <DrawerSuspense>
        <PaymentInvoicePreviewContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const PaymentInvoicePreviewDrawer = R.compose(withDrawers())(
  PaymentInvoicePreviewDrawerRoot,
);
